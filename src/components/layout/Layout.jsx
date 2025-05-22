import React from "react";
import { getSystemInfo } from "zmp-sdk";
import {
  App,
  SnackbarProvider,
  ZMPRouter,
  AnimationRoutes,
  Route,
  Box,
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
import "../../css/layout.css";
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
      return <h1>Đã xảy ra lỗi. Vui lòng thử lại sau.</h1>;
    }
    return this.props.children;
  }
}

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme}>
      <SnackbarProvider>
        <ZMPRouter>
          <ErrorBoundary>
            <Box className="app-layout">
              <Header />
              <Box className="main-content">
                <AnimationRoutes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/feedback" element={<FeedbackPage />} />
                  <Route path="/blogs" element={<BlogPage />} />
                  <Route path="/blogs/:id" element={<BlogDetailPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </AnimationRoutes>
              </Box>
              <Navigation />
            </Box>
          </ErrorBoundary>
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
};

export default Layout;