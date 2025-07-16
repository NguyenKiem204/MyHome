import React from "react";
import { SnackbarProvider, Box, useLocation } from "zmp-ui";
import Header from "./Header";
import Navigation from "./Navigation";
import useTokenRefresh from "../hooks/useTokenRefresh";

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

  return (
    <SnackbarProvider>
      <ErrorBoundary>
        <Box className="app-layout">
          {showNavigationAndHeader && <Header />}
          <Box className="main-content">{children}</Box>
          {showNavigationAndHeader && <Navigation />}
        </Box>
      </ErrorBoundary>
    </SnackbarProvider>
  );
};

export default Layout;
