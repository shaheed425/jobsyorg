import { useState, useCallback } from 'react';
import { applicationsAPI, studentsAPI, jobsAPI, notificationsAPI } from '../data/api';

export const useApplications = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await applicationsAPI.getAll();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkJobEligibility = (student, eligibilityCriteria) => {
    if (!eligibilityCriteria) return true;
    if (eligibilityCriteria.minCGPA && student.cgpa < eligibilityCriteria.minCGPA) return false;
    if (eligibilityCriteria.departments && !eligibilityCriteria.departments.includes(student.department)) return false;
    if (eligibilityCriteria.year && student.year < eligibilityCriteria.year) return false;
    return true;
  };

  const validateApplicationData = (applicationData) => {
    const requiredFields = ['studentId', 'jobId', 'coverLetter'];
    for (const field of requiredFields) {
      if (!applicationData[field]) {
        throw new Error(`${field} is required`);
      }
    }
    if (applicationData.coverLetter.length < 50) throw new Error('Cover letter must be at least 50 characters long');
    if (applicationData.coverLetter.length > 1000) throw new Error('Cover letter must not exceed 1000 characters');
  };

  const submitApplication = useCallback(async (applicationData) => {
    setLoading(true);
    setError(null);
    try {
      validateApplicationData(applicationData);
      const student = await studentsAPI.getById(applicationData.studentId);
      if (!student) throw new Error('Student not found');
      if (!student.isEligible) throw new Error('Student is not eligible for placements');

      const job = await jobsAPI.getById(applicationData.jobId);
      if (!job) throw new Error('Job not found');
      if (job.status !== 'active') throw new Error('Job is no longer accepting applications');
      if (new Date() > new Date(job.applicationDeadline)) throw new Error('Application deadline has passed');

      if (!checkJobEligibility(student, job.eligibilityCriteria)) {
        throw new Error('Student does not meet job eligibility criteria');
      }

      const existingApplications = await applicationsAPI.getByStudentId(applicationData.studentId);
      if (existingApplications.some(app => app.jobId === applicationData.jobId)) {
        throw new Error('You have already applied for this job');
      }

      const newApplication = await applicationsAPI.create({
        ...applicationData,
        studentName: student.name,
        jobTitle: job.title,
        company: job.company,
        status: 'under_review'
      });

      const updatedAppliedJobs = [...student.appliedJobs, applicationData.jobId];
      await studentsAPI.update(applicationData.studentId, { appliedJobs: updatedAppliedJobs });

      await notificationsAPI.create({
        type: 'application_submitted',
        title: 'Application Submitted Successfully',
        message: `Your application for ${job.title} at ${job.company} has been submitted.`,
        recipient: 'student',
        recipientId: applicationData.studentId,
        priority: 'medium',
        relatedApplicationId: newApplication.id
      });

      return newApplication;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getApplicationsByStudent = useCallback(async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      return await applicationsAPI.getByStudentId(studentId);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getApplicationsByJob = useCallback(async (jobId) => {
    setLoading(true);
    setError(null);
    try {
      return await applicationsAPI.getByJobId(jobId);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApplicationStatus = useCallback(async (applicationId, status, feedback = null, interviewDate = null) => {
    setLoading(true);
    setError(null);
    try {
      const application = await applicationsAPI.updateStatus(applicationId, status, feedback);
      const statusMessages = {
        under_review: 'Your application is under review.',
        shortlisted: 'Congratulations! You have been shortlisted.',
        accepted: 'Congratulations! Your application has been accepted.',
        rejected: 'Unfortunately, your application was not selected.'
      };

      if (statusMessages[status]) {
        await notificationsAPI.create({
          type: 'application_status',
          title: 'Application Status Update',
          message: `${application.jobTitle} at ${application.company} - ${statusMessages[status]}`,
          recipient: 'student',
          recipientId: application.studentId,
          priority: status === 'accepted' ? 'high' : 'medium',
          relatedApplicationId: applicationId
        });
      }

      if (interviewDate) {
        await notificationsAPI.create({
          type: 'interview_schedule',
          title: 'Interview Scheduled',
          message: `Your interview for ${application.jobTitle} is scheduled for ${new Date(interviewDate).toLocaleString()}.`,
          recipient: 'student',
          recipientId: application.studentId,
          priority: 'high',
          relatedApplicationId: applicationId
        });
      }
      return application;
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
    getAllApplications,
    submitApplication,
    getApplicationsByStudent,
    getApplicationsByJob,
    updateApplicationStatus
  };
};
