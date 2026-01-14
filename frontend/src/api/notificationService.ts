import axios from './axiosConfig';

export interface Notification {
  notification_id: number;
  user_id: number;
  title: string;
  message: string;
  notification_type: 'booking_confirm' | 'assignment' | 'payment' | 'status_update' | 'general';
  is_read: boolean;
  created_at: string;
}

export const getUserNotifications = async (): Promise<Notification[]> => {
  const response = await axios.get('/notifications');
  return response.data;
};

export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  await axios.put(`/notifications/${notificationId}/read`);
};