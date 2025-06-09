// src/components/layout/Layout.jsx - Cập nhật để xử lý authentication tốt hơn
import React, { useEffect, useState } from "react";
import {
  SnackbarProvider,
  AnimationRoutes,
  Route,
  Box,
  useNavigate,
  useLocation,
} from "zmp-ui";
import Header from "./Header";
import Navigation from "./Navigation";
import HomePage from "../../pages";
import ProfilePage from "../../pages/ProfilePage";
import FeedbackPage from "../../pages/FeedbackPage";
import BlogPage from "../../pages/BlogPage";
import BlogDetailPage from "../../pages/BlogDetailPage";
import ServicesPage from "../../pages/ServicesPage";
import NotFoundPage from "../../pages/NotFoundPage";
import LoginPage from "../../pages/LoginPage";
import { isAuthenticated, refreshTokenIfNeeded } from "../../utils/auth";

// Component ProtectedRoute
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Kiểm tra authentication hiện tại
        if (isAuthenticated()) {
          setIsAuthed(true);
          setIsChecking(false);
          return;
        }

        // Thử refresh token nếu chưa authenticated
        const refreshed = await refreshTokenIfNeeded();
        if (refreshed) {
          setIsAuthed(true);
        } else {
          setIsAuthed(false);
          // Chỉ redirect về login nếu không phải đang ở trang login
          if (location.pathname !== "/login") {
            navigate("/login", { replace: true });
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthed(false);
        if (location.pathname !== "/login") {
          navigate("/login", { replace: true });
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  // Hiển thị loading trong khi check authentication
  if (isChecking) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </Box>
    );
  }

  return isAuthed || location.pathname === "/login" ? children : null;
};

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
            <h1 className="text-2xl font-bold text-red-600 mb-4">Đã xảy ra lỗi</h1>
            <p className="text-gray-600 mb-4">Vui lòng thử lại sau hoặc liên hệ hỗ trợ.</p>
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

const Layout = () => {
  const location = useLocation();
  const showNavigationAndHeader = location.pathname !== "/login";

  return (
    <SnackbarProvider>
      <ErrorBoundary>
        <Box className="app-layout">
          {showNavigationAndHeader && <Header />}
          <Box className="main-content">
            <AnimationRoutes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
              <Route path="/blog-detail/:id" element={<ProtectedRoute><BlogDetailPage /></ProtectedRoute>} />
              <Route path="/blogs" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
              <Route path="/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
              <Route path="*" element={<ProtectedRoute><NotFoundPage /></ProtectedRoute>} />
            </AnimationRoutes>
          </Box>
          {showNavigationAndHeader && <Navigation />}
        </Box>
      </ErrorBoundary>
    </SnackbarProvider>
  );
};

export default Layout;