import { useState, useCallback } from 'react';
import { employersAPI, jobsAPI, applicationsAPI, notificationsAPI } from '../data/api';

export const useEmployers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllEmployers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await employersAPI.getAll();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEmployerById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      return await employersAPI.getById(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const validateEmployerData = (employerData) => {
    const requiredFields = ['companyName', 'email', 'phone', 'website', 'address', 'industry', 'contactPerson'];
    for (const field of requiredFields) {
      if (!employerData[field]) {
        throw new Error(`${field} is required`);
      }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employerData.email)) {
      throw new Error('Invalid email format');
    }
    try {
      new URL(employerData.website);
    } catch {
      throw new Error('Invalid website URL');
    }
  };

  const registerEmployer = useCallback(async (employerData) => {
    setLoading(true);
    setError(null);
    try {
      validateEmployerData(employerData);
      const newEmployer = await employersAPI.create({
        ...employerData,
        isVerified: false,
        jobsPosted: []
      });

      await notificationsAPI.create({
        type: 'company_registration',
        title: 'Company Registration Received',
        message: 'Your company registration is under review.',
        recipient: 'employer',
        recipientId: newEmployer.id,
        priority: 'medium'
      });

      return newEmployer;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEmployerProfile = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      return await employersAPI.update(id, updateData);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyEmployer = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const updatedEmployer = await employersAPI.update(id, { isVerified: true });
      await notificationsAPI.create({
        type: 'company_verification',
        title: 'Company Profile Verified',
        message: 'Your company profile has been verified.',
        recipient: 'employer',
        recipientId: id,
        priority: 'high'
      });
      return updatedEmployer;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEmployerJobs = useCallback(async (employerId) => {
    setLoading(true);
    setError(null);
    try {
      const allJobs = await jobsAPI.getAll();
      return allJobs.filter(job => job.companyId === parseInt(employerId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const validateJobData = (jobData) => {
    const requiredFields = ['title', 'location', 'jobType', 'experience', 'salary', 'description', 'requirements'];
    for (const field of requiredFields) {
      if (!jobData[field]) {
        throw new Error(`${field} is required`);
      }
    }
    if (jobData.eligibilityCriteria) {
      if (!jobData.eligibilityCriteria.minCGPA || jobData.eligibilityCriteria.minCGPA < 0 || jobData.eligibilityCriteria.minCGPA > 10) {
        throw new Error('Valid minimum CGPA is required (0-10)');
      }
      if (!jobData.eligibilityCriteria.departments || jobData.eligibilityCriteria.departments.length === 0) {
        throw new Error('At least one department must be specified');
      }
    }
  };

  const postJob = useCallback(async (employerId, jobData) => {
    setLoading(true);
    setError(null);
    try {
      const employer = await employersAPI.getById(employerId);
      if (!employer) throw new Error('Employer not found');
      if (!employer.isVerified) throw new Error('Company must be verified to post jobs');

      validateJobData(jobData);
      const newJob = await jobsAPI.create({
        ...jobData,
        companyId: employerId,
        company: employer.companyName
      });

      const updatedJobsList = [...employer.jobsPosted, newJob.id];
      await employersAPI.update(employerId, { jobsPosted: updatedJobsList });

      await notificationsAPI.create({
        type: 'job_posting',
        title: `New Job Posted: ${jobData.title}`,
        message: `${employer.companyName} has posted a new ${jobData.title} position.`,
        recipient: 'all_students',
        priority: 'medium',
        relatedJobId: newJob.id
      });

      return newJob;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEmployerApplications = useCallback(async (employerId) => {
    setLoading(true);
    setError(null);
    try {
      const allJobs = await jobsAPI.getAll();
      const employerJobs = allJobs.filter(job => job.companyId === parseInt(employerId));
      const jobIds = employerJobs.map(job => job.id);
      const allApplications = await applicationsAPI.getAll();
      return allApplications.filter(app => jobIds.includes(app.jobId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApplicationStatus = useCallback(async (applicationId, status, feedback = null) => {
    setLoading(true);
    setError(null);
    try {
      const updatedApplication = await applicationsAPI.updateStatus(applicationId, status, feedback);
      const statusMessages = {
        shortlisted: 'Congratulations! You have been shortlisted.',
        accepted: 'Congratulations! Your application has been accepted.',
        rejected: 'Thank you for your interest. Unfortunately, your application was not selected.'
      };

      if (statusMessages[status]) {
        await notificationsAPI.create({
          type: 'application_status',
          title: 'Application Status Update',
          message: `Your application for ${updatedApplication.jobTitle} - ${statusMessages[status]}`,
          recipient: 'student',
          recipientId: updatedApplication.studentId,
          priority: 'high',
          relatedApplicationId: applicationId
        });
      }
      return updatedApplication;
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
    getAllEmployers,
    getEmployerById,
    registerEmployer,
    updateEmployerProfile,
    verifyEmployer,
    getEmployerJobs,
    postJob,
    getEmployerApplications,
    updateApplicationStatus
  };
};
