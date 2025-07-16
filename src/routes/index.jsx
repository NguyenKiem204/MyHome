import React, { useEffect, useState } from "react";
import { AnimationRoutes, Route, Box, useNavigate, useLocation } from "zmp-ui";
import HomePage from "../pages";
import ProfilePage from "../pages/ProfilePage";
import FeedbackPage from "../pages/FeedbackPage";
import BlogPage from "../pages/BlogPage";
import BlogDetailPage from "../pages/BlogDetailPage";
import ServicesPage from "../pages/ServicesPage";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage";
import BuildingSelectorPage from "../pages/building-selector";
import { isAuthenticated, refreshTokenIfNeeded } from "../services/auth";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isAuthenticated() && location.pathname !== "/building-selector") {
          navigate("/building-selector", { replace: true });
          return;
        }
        if (isAuthenticated()) {
          setIsAuthed(true);
          setIsChecking(false);
          return;
        }
        const refreshed = await refreshTokenIfNeeded();
        if (refreshed) {
          setIsAuthed(true);
        } else {
          setIsAuthed(false);
          if (location.pathname !== "/login") {
            navigate("/login", { replace: true });
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthed(false);
        if (location.pathname !== "/login") {
          navigate("/login", { replace: true });
        }
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
    // eslint-disable-next-line
  }, [navigate, location.pathname]);

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

  return isAuthed ||
    location.pathname === "/login" ||
    location.pathname === "/building-selector"
    ? children
    : null;
};

const Routes = () => (
  <AnimationRoutes>
    <Route path="/building-selector" element={<BuildingSelectorPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/feedback"
      element={
        <ProtectedRoute>
          <FeedbackPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/blog-detail/:id"
      element={
        <ProtectedRoute>
          <BlogDetailPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/blogs"
      element={
        <ProtectedRoute>
          <BlogPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/services"
      element={
        <ProtectedRoute>
          <ServicesPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="*"
      element={
        <ProtectedRoute>
          <NotFoundPage />
        </ProtectedRoute>
      }
    />
  </AnimationRoutes>
);

export default Routes;
