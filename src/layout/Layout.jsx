import React, { useState, useEffect } from "react";
import { SnackbarProvider, Box, useLocation } from "zmp-ui";
import Header from "./Header";
import Navigation from "./Navigation";
import useTokenRefresh from "../hooks/useTokenRefresh";
import ZaloFeedbackWebSocket from "../services/ZaloFeedbackWebSocket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getStoredNotifications,
  storeNotification,
  clearNotifications,
  markAllNotificationsRead,
} from "../utils/notification";
import { Bell } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Đã xảy ra lỗi
            </h1>
            <p className="text-gray-600 mb-4">
              Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tải lại trang
            </button>
          </div>
        </Box>
      );
    }
    return this.props.children;
  }
}

const Layout = ({ children }) => {
  useTokenRefresh();
  const location = useLocation();
  const showNavigationAndHeader =
    location.pathname !== "/login" &&
    location.pathname !== "/building-selector";

  // Gọi syncAuth khi Layout mount để khởi tạo user vào store
  const syncAuth = useAuthStore((state) => state.syncAuth);
  useEffect(() => {
    syncAuth();
  }, [syncAuth]);

  // Lấy email user từ localStorage (hoặc context nếu có)
  const [email] = useState(() => localStorage.getItem("userEmail") || "");
  const [notifications, setNotifications] = useState(getStoredNotifications());
  const [showNotification, setShowNotification] = useState(false);

  // Callback khi có feedback mới (cho admin)
  const handleFeedbackNew = (feedback) => {
    const notification = {
      type: "feedback_new",
      message: `Có feedback mới: ${feedback.Title || feedback.title || ""}`,
      feedback,
      time: new Date().toLocaleString(),
    };
    toast.info(
      <div>
        <b>Có feedback mới!</b>
        <div>{feedback.Title || feedback.title || ""}</div>
      </div>
    );
    storeNotification(notification);
    setNotifications(getStoredNotifications());
  };

  // Callback khi feedback user đổi trạng thái
  const handleFeedbackStatus = (status, feedback) => {
    const notification = {
      type: "feedback_status",
      message: `Phản ánh "${
        feedback.Title || feedback.title || "Không rõ tiêu đề"
      }" - trạng thái: ${status}`,
      feedback,
      time: new Date().toLocaleString(),
    };
    toast.success(
      <div>
        <b>Feedback cập nhật!</b>
        <div>
          {`Phản ánh "${
            feedback.Title || feedback.title || "Không rõ tiêu đề"
          }"`}
          <br />
          Trạng thái: {status}
        </div>
      </div>
    );
    storeNotification(notification);
    setNotifications(getStoredNotifications());
  };

  // Cho phép xóa lịch sử nếu muốn
  const handleClearNotifications = () => {
    clearNotifications();
    setNotifications([]);
  };

  // Khi mở popup notification, đánh dấu tất cả là đã đọc
  const handleNotificationClick = () => {
    const next = !showNotification;
    setShowNotification(next);
    if (!showNotification && email) {
      markAllNotificationsRead();
      setNotifications(getStoredNotifications());
    }
  };

  // Tính số lượng thông báo chưa đọc
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SnackbarProvider>
      {/* WebSocket notification */}
      {email && (
        <ZaloFeedbackWebSocket
          email={email}
          onFeedbackNew={handleFeedbackNew}
          onFeedbackStatus={handleFeedbackStatus}
        />
      )}
      <ToastContainer position="bottom-right" />
      {/* Popup notification ở dưới, có nút đóng */}
      {email && showNotification && (
        <div className="fixed bottom-20 right-4 w-80 z-[9999] bg-white rounded-xl shadow-lg p-4 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <b className="text-base">Lịch sử thông báo</b>
            <button
              onClick={() => setShowNotification(false)}
              className="text-lg text-gray-400 hover:text-red-500 bg-none border-none cursor-pointer"
              aria-label="Đóng"
            >
              ×
            </button>
          </div>
          <ul className="max-h-72 overflow-y-auto m-0 p-0">
            {notifications.length === 0 && (
              <li className="text-gray-400 py-2">Chưa có thông báo nào</li>
            )}
            {notifications.map((n, idx) => (
              <li key={idx} className="border-b border-gray-100 py-2">
                <div className="text-xs text-gray-500">{n.time}</div>
                <div>{n.message}</div>
              </li>
            ))}
          </ul>
          <button
            onClick={handleClearNotifications}
            className="mt-2 text-xs text-gray-500 hover:text-red-500 bg-none border-none cursor-pointer float-right"
          >
            Xóa hết
          </button>
        </div>
      )}
      <ErrorBoundary>
        <Box className="app-layout">
          {showNavigationAndHeader && <Header />}
          <Box className="main-content">{children}</Box>
          {showNavigationAndHeader && (
            <Navigation
              onNotificationClick={handleNotificationClick}
              notificationCount={unreadCount}
            />
          )}
        </Box>
      </ErrorBoundary>
    </SnackbarProvider>
  );
};

export default Layout;
