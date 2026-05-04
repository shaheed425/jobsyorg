import { useState, useCallback } from 'react';
import { jobsAPI, studentsAPI, applicationsAPI } from '../data/api';

export const useJobs = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await jobsAPI.getAll();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getJobById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      return await jobsAPI.getById(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getActiveJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allJobs = await jobsAPI.getAll();
      return allJobs.filter(job => 
        job.status === 'active' && 
        new Date(job.applicationDeadline) > new Date()
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchJobs = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      let jobs = await jobsAPI.getAll();
      if (filters.location) {
        jobs = jobs.filter(job => job.location.toLowerCase().includes(filters.location.toLowerCase()));
      }
      if (filters.jobType) {
        jobs = jobs.filter(job => job.jobType === filters.jobType);
      }
      if (filters.company) {
        jobs = jobs.filter(job => job.company.toLowerCase().includes(filters.company.toLowerCase()));
      }
      if (filters.experience) {
        jobs = jobs.filter(job => job.experience.toLowerCase().includes(filters.experience.toLowerCase()));
      }
      if (filters.minSalary) {
        jobs = jobs.filter(job => {
          const salaryMatch = job.salary.match(/\$(\d+,?\d*)/);
          if (salaryMatch) {
            const jobMinSalary = parseInt(salaryMatch[1].replace(',', ''));
            return jobMinSalary >= filters.minSalary;
          }
          return true;
        });
      }
      if (filters.skills && filters.skills.length > 0) {
        jobs = jobs.filter(job => 
          job.skills && job.skills.some(skill => 
            filters.skills.some(filterSkill => 
              skill.toLowerCase().includes(filterSkill.toLowerCase())
            )
          )
        );
      }
      if (filters.department) {
        jobs = jobs.filter(job => 
          job.eligibilityCriteria && 
          job.eligibilityCriteria.departments &&
          job.eligibilityCriteria.departments.includes(filters.department)
        );
      }
      jobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
      return jobs;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getJobsForStudent = useCallback(async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const student = await studentsAPI.getById(studentId);
      if (!student) throw new Error('Student not found');
      const allJobs = await jobsAPI.getAll();
      const activeJobs = allJobs.filter(job => 
        job.status === 'active' && 
        new Date(job.applicationDeadline) > new Date()
      );
      
      return activeJobs.filter(job => {
        if (!student.isEligible) return false;
        if (student.appliedJobs && student.appliedJobs.includes(job.id)) return false;
        if (job.eligibilityCriteria) {
          if (job.eligibilityCriteria.minCGPA && student.cgpa < job.eligibilityCriteria.minCGPA) return false;
          if (job.eligibilityCriteria.departments && !job.eligibilityCriteria.departments.includes(student.department)) return false;
          if (job.eligibilityCriteria.year && student.year < job.eligibilityCriteria.year) return false;
        }
        return true;
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecommendedJobs = useCallback(async (studentId, limit = 5) => {
    setLoading(true);
    setError(null);
    try {
      const student = await studentsAPI.getById(studentId);
      if (!student) throw new Error('Student not found');
      const suitableJobs = await getJobsForStudent(studentId);
      
      const scoredJobs = suitableJobs.map(job => {
        let score = 0;
        if (job.skills && student.skills) {
          const matchingSkills = job.skills.filter(skill => 
            student.skills.some(studentSkill => studentSkill.toLowerCase().includes(skill.toLowerCase()))
          );
          score += matchingSkills.length * 10;
        }
        if (job.eligibilityCriteria && job.eligibilityCriteria.departments && job.eligibilityCriteria.departments.includes(student.department)) {
          score += 20;
        }
        if (job.eligibilityCriteria && job.eligibilityCriteria.minCGPA) {
          score += Math.max(0, student.cgpa - job.eligibilityCriteria.minCGPA) * 5;
        }
        const daysSincePosted = (new Date() - new Date(job.postedDate)) / (1000 * 60 * 60 * 24);
        if (daysSincePosted < 7) score += 15;
        return { ...job, recommendationScore: score };
      });

      return scoredJobs.sort((a, b) => b.recommendationScore - a.recommendationScore).slice(0, limit);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getJobsForStudent]);

  const getJobDetails = useCallback(async (jobId) => {
    setLoading(true);
    setError(null);
    try {
      const job = await jobsAPI.getById(jobId);
      if (!job) throw new Error('Job not found');

      const applications = await applicationsAPI.getByJobId(jobId);
      
      const isDeadlineApproaching = (job, daysThreshold = 3) => {
        const deadline = new Date(job.applicationDeadline);
        const now = new Date();
        const diffTime = deadline - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= daysThreshold && diffDays > 0;
      };

      return {
        job,
        applicationCount: applications.length,
        applications: applications.slice(0, 10),
        isDeadlineApproaching: isDeadlineApproaching(job),
        daysUntilDeadline: Math.ceil((new Date(job.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24))
      };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getAllJobs,
    getJobById,
    getActiveJobs,
    searchJobs,
    getJobsForStudent,
    getRecommendedJobs,
    getJobDetails
  };
};
