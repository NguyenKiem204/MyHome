export const NOTIFICATION_KEY = "myhome_notifications";

export function getStoredNotifications() {
  try {
    return JSON.parse(localStorage.getItem(NOTIFICATION_KEY)) || [];
  } catch {
    return [];
  }
}

export function storeNotification(notification) {
  const current = getStoredNotifications();
  // Luôn thêm read: false cho notification mới
  const newNotification = { ...notification, read: false };
  current.unshift(newNotification); // Thêm mới lên đầu
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(current.slice(0, 100)));
}

export function clearNotifications() {
  localStorage.removeItem(NOTIFICATION_KEY);
}

// Đánh dấu tất cả notification là đã đọc
export function markAllNotificationsRead() {
  const current = getStoredNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated));
}
