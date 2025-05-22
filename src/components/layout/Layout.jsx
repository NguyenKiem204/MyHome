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
            <Box
              className="app-container"
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden",
              }}
            >
              <Header />
              <Box
                className="content-container"
                style={{
                  flex: 1,
                  overflowY: "auto",
                  overflowX: "hidden",
                  paddingTop: "56px", // Header height
                  paddingBottom: "70px", // Navigation height
                  WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
                }}
              >
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