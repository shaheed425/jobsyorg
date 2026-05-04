import { useState, useCallback } from 'react';
import { studentsAPI, notificationsAPI, applicationsAPI } from '../data/api';

export const useStudents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentsAPI.getAll();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStudentById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentsAPI.getById(id);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkEligibility = (studentData) => {
    const minCGPA = 7.0;
    const requiredYear = 4;
    return studentData.cgpa >= minCGPA && studentData.year >= requiredYear;
  };

  const validateStudentData = (studentData) => {
    const requiredFields = ['name', 'email', 'phone', 'department', 'year', 'cgpa'];
    for (const field of requiredFields) {
      if (!studentData[field]) {
        throw new Error(`${field} is required`);
      }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentData.email)) {
      throw new Error('Invalid email format');
    }
    if (studentData.cgpa < 0 || studentData.cgpa > 10) {
      throw new Error('CGPA must be between 0 and 10');
    }
    if (studentData.year < 1 || studentData.year > 4) {
      throw new Error('Year must be between 1 and 4');
    }
  };

  const registerStudent = useCallback(async (studentData) => {
    setLoading(true);
    setError(null);
    try {
      validateStudentData(studentData);
      const isEligible = checkEligibility(studentData);
      const newStudent = await studentsAPI.create({
        ...studentData,
        isEligible,
        appliedJobs: []
      });

      await notificationsAPI.create({
        type: 'profile_created',
        title: 'Welcome to Placement Portal',
        message: 'Your student profile has been created successfully.',
        recipient: 'student',
        recipientId: newStudent.id,
        priority: 'medium'
      });

      return newStudent;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStudentProfile = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedData = {
        ...updateData,
        isEligible: checkEligibility(updateData)
      };
      return await studentsAPI.update(id, updatedData);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateStudentReport = useCallback(async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const student = await studentsAPI.getById(studentId);
      const applications = await applicationsAPI.getByStudentId(studentId);
      return {
        student,
        totalApplications: applications.length,
        applicationsByStatus: {
          under_review: applications.filter(app => app.status === 'under_review').length,
          shortlisted: applications.filter(app => app.status === 'shortlisted').length,
          accepted: applications.filter(app => app.status === 'accepted').length,
          rejected: applications.filter(app => app.status === 'rejected').length
        },
        recentApplications: applications.slice(-5),
        eligibilityStatus: student.isEligible ? 'Eligible' : 'Not Eligible'
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
    getAllStudents,
    getStudentById,
    registerStudent,
    updateStudentProfile,
    generateStudentReport,
    checkEligibility
  };
};
