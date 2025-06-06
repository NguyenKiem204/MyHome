// src/pages/NotFoundPage.jsx
import React from "react";
import { Page, Box, Button, Text } from "zmp-ui";
import { AlertOctagon, Home } from "lucide-react";

const NotFoundPage = () => {
  return (
    <Page className="flex items-center justify-center h-screen bg-gray-100">
      <Box className="text-center p-6 max-w-md mx-auto bg-white shadow-xl rounded-2xl">
        <Box className="flex justify-center mb-6">
          <AlertOctagon size={64} className="text-gray-400" />
        </Box>
        <Text className="text-5xl font-bold text-gray-700 mb-2">404</Text>
        <Text className="text-xl font-semibold text-gray-800 mb-2">
          Trang không tồn tại
        </Text>
        <Text className="text-gray-500 mb-6">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </Text>
        <Button
          fullWidth
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 text-base"
          suffixIcon={<Home size={18} />}
          onClick={() => (window.location.href = "/")}
        >
          Quay về trang chủ
        </Button>
      </Box>
    </Page>
  );
};

export default NotFoundPage;
