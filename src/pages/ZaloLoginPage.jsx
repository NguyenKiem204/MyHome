import React from 'react';
import { Page, Box, Text, Button, useSnackbar } from 'zmp-ui';
import { useNavigate } from 'zmp-ui';
import { getAccessToken, getUserInfo } from 'zmp-sdk/apis';

const ZaloLoginPage = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const handleZaloLogin = async () => {
    try {
      // Lấy thông tin người dùng từ ZMP SDK
      const userInfoResponse = await getUserInfo({});
      const { name, avatar } = userInfoResponse.userInfo;

      // Lấy Zalo Access Token từ ZMP SDK
      const { accessToken: zaloAccessToken } = await getAccessToken({});
      
      if (!zaloAccessToken) {
        openSnackbar({
          text: 'Không thể lấy Zalo Access Token. Vui lòng thử lại.',
          type: 'error',
        });
        return;
      }

      // Gửi zaloAccessToken lên Backend của bạn
      const backendUrl = 'http://localhost:8080/api/auth/zalo-login'; // Thay thế bằng URL Backend của bạn
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ zaloAccessToken: zaloAccessToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Đăng nhập thành công
        localStorage.setItem('accessToken', data.data.accessToken); // Lưu access token vào localStorage
        // Refresh token sẽ được đặt trong HttpOnly cookie bởi Backend (không cần xử lý ở FE)
        openSnackbar({
          text: 'Đăng nhập Zalo thành công!',
          type: 'success',
        });
        navigate('/'); // Chuyển hướng về trang chủ
      } else {
        // Xử lý lỗi từ Backend
        const errorMessage = data.message || 'Đăng nhập Zalo thất bại!';
        openSnackbar({
          text: errorMessage,
          type: 'error',
        });
        // Nếu là lỗi PendingApproval, hiển thị thông báo và không chuyển hướng về trang login
        if (data.message && data.message.includes("pending approval")) {
            // Có thể thêm logic hiển thị popup hoặc trang chờ duyệt ở đây
        } else {
            // Về lại trang đăng nhập Zalo hoặc giữ nguyên trang
            navigate('/zalo-login');
        }
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập Zalo:', error);
      openSnackbar({
        text: 'Có lỗi xảy ra khi đăng nhập Zalo. Vui lòng thử lại.',
        type: 'error',
      });
    }
  };

  return (
    <Page className="flex flex-col items-center justify-center h-full bg-gray-100">
      <Box className="p-4 w-full max-w-sm rounded-lg shadow-md bg-white text-center">
        <Text.Title className="text-2xl font-bold mb-6 text-gray-800">Đăng nhập</Text.Title>
        <img
          src="https://placehold.co/100x100/A855F7/FFFFFF?text=Zalo"
          alt="Zalo Icon"
          className="mx-auto mb-6 rounded-full shadow-lg"
        />
        <Button
          fullWidth
          className="bg-blue-600 text-white rounded-lg py-3 flex items-center justify-center space-x-2 text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-md"
          onClick={handleZaloLogin}
        >
          <img src="https://img.icons8.com/color/48/zalo.png" alt="Zalo icon" className="h-6 w-6" />
          <Text className="text-white">Đăng nhập bằng Zalo</Text>
        </Button>
        <Text className="text-sm text-gray-500 mt-4">
          Ứng dụng sẽ sử dụng thông tin Zalo của bạn để tạo tài khoản.
        </Text>
      </Box>
    </Page>
  );
};

export default ZaloLoginPage;
