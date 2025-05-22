// src/pages/NotFoundPage.jsx
import React from "react";
import { Box, Page, Text, Button } from "zmp-ui";
import { AlertOctagon, Home } from "lucide-react";
// import "../css/not-found.css";

const NotFoundPage = () => {
  return (
    <Page className="not-found-page">
      <Box className="not-found-container">
        <Box className="not-found-icon">
          <AlertOctagon size={64} color="#6B7280" />
        </Box>
        <Text className="not-found-code">404</Text>
        <Text className="not-found-title">Trang không tồn tại</Text>
        <Text className="not-found-message">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </Text>
        <Button
          className="go-home-btn"
          fullWidth
          suffixIcon={<Home size={18} />}
          onClick={() => window.location.href = "/"}
        >
          Quay về trang chủ
        </Button>
      </Box>
    </Page>
  );
};

export default NotFoundPage;