import { useState, useCallback } from 'react';
import { notificationsAPI } from '../data/api';

export const useNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await notificationsAPI.getAll();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getNotificationsForRecipient = useCallback(async (recipient, recipientId = null) => {
    setLoading(true);
    setError(null);
    try {
      const notifications = await notificationsAPI.getByRecipient(recipient, recipientId);
      return notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const validateNotificationData = (notificationData) => {
    const requiredFields = ['type', 'title', 'message', 'recipient', 'priority'];
    for (const field of requiredFields) {
      if (!notificationData[field]) {
        throw new Error(`${field} is required`);
      }
    }
    const validTypes = ['job_posting', 'application_status', 'interview_schedule', 'deadline_reminder', 'profile_update', 'company_verification'];
    if (!validTypes.includes(notificationData.type)) throw new Error('Invalid notification type');
    const validRecipients = ['student', 'employer', 'all_students', 'all_employers'];
    if (!validRecipients.includes(notificationData.recipient)) throw new Error('Invalid recipient type');
    const validPriorities = ['high', 'medium', 'low'];
    if (!validPriorities.includes(notificationData.priority)) throw new Error('Invalid priority level');
    if (notificationData.message.length > 500) throw new Error('Message must not exceed 500 characters');
  };

  const createNotification = useCallback(async (notificationData) => {
    setLoading(true);
    setError(null);
    try {
      validateNotificationData(notificationData);
      return await notificationsAPI.create(notificationData);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    setLoading(true);
    setError(null);
    try {
      return await notificationsAPI.markAsRead(notificationId);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUnreadCount = useCallback(async (recipient, recipientId = null) => {
    try {
      const notifications = await getNotificationsForRecipient(recipient, recipientId);
      return notifications.filter(notif => !notif.isRead).length;
    } catch (err) {
      throw err;
    }
  }, [getNotificationsForRecipient]);

  return {
    loading,
    error,
    getAllNotifications,
    getNotificationsForRecipient,
    createNotification,
    markAsRead,
    getUnreadCount
  };
};
