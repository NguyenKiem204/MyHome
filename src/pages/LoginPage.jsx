import React, { useState, useEffect } from "react";
import { Page, Box, Text, Button } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import { getAccessToken } from "zmp-sdk/apis";
import axios from "axios";
import { isAuthenticated, setAccessToken } from "../utils/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleZaloLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      // Lấy access token trực tiếp từ ZMP SDK
      const tokenResponse = await getAccessToken({});
      console.log("Zalo access token response from ZMP SDK:", tokenResponse);

      // SỬA LỖI: Kiểm tra cấu trúc response đúng cách
      let accessToken;
      
      // Trường hợp 1: Response là object có thuộc tính access_token
      if (tokenResponse && typeof tokenResponse === 'object' && tokenResponse.access_token) {
        accessToken = tokenResponse.access_token;
      }
      // Trường hợp 2: Response trực tiếp là string token
      else if (tokenResponse && typeof tokenResponse === 'string') {
        accessToken = tokenResponse;
      }
      // Trường hợp 3: Response có thuộc tính data
      else if (tokenResponse && tokenResponse.data && tokenResponse.data.access_token) {
        accessToken = tokenResponse.data.access_token;
      }

      console.log("Extracted access token:", accessToken);

      if (!accessToken || accessToken.trim() === '') {
        setError("Không thể lấy access token từ Zalo. Vui lòng thử lại.");
        console.error("Access token is undefined, null, or empty. Full response:", tokenResponse);
        setLoading(false);
        return;
      }

      // Gửi access token lên server
      const response = await axios.post(
        "https://harmless-right-chipmunk.ngrok-free.app/api/auth/zalo-login", 
        {
          accessToken: accessToken,
        }, 
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

      console.log("Server response:", response.data);

      if (response.data.success) {
        console.log("Login successful, response:", response.data);
        
        // QUAN TRỌNG: Lưu accessToken vào localStorage để frontend có thể kiểm tra authentication
        const authData = response.data.data;
        if (authData.accessToken && authData.expiresIn) {
          setAccessToken(authData.accessToken, authData.expiresIn);
        }
        
        // Redirect về trang chủ
        navigate("/", { replace: true });
      } else {
        setError(response.data.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Zalo login error:", err);
      
      // Xử lý các loại lỗi khác nhau
      if (err.response) {
        // Server response with error status
        const errorMessage = err.response.data?.message || err.response.data?.error || 'Lỗi từ server';
        console.error("Server error response:", err.response.data);
        setError(errorMessage);
      } else if (err.request) {
        // Network error
        console.error("Network error:", err.request);
        setError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
      } else {
        // Other errors
        console.error("Other error:", err.message);
        setError("Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Thêm function để test access token (optional)
  const testAccessToken = async () => {
    try {
      const tokenResponse = await getAccessToken({});
      console.log("=== ACCESS TOKEN TEST ===");
      console.log("Type of response:", typeof tokenResponse);
      console.log("Full response:", tokenResponse);
      console.log("Response keys:", tokenResponse ? Object.keys(tokenResponse) : 'null');
      console.log("========================");
    } catch (error) {
      console.error("Error testing access token:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/", { replace: true });
    }
    
    // Uncomment dòng dưới để debug access token structure
    // testAccessToken();
  }, []);

  return (
    <Page className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse"></div>
      </div>
      
      {/* Floating geometric shapes */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 animate-bounce delay-1000"></div>
      <div className="absolute top-32 right-16 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg rotate-45 opacity-30 animate-spin delay-2000" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-25 animate-pulse delay-500"></div>
      <div className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-r from-green-400 to-teal-500 rounded-full opacity-20 animate-bounce delay-1500"></div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Glassmorphism card */}
          <Box className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-500 ease-out">
            {/* Logo/Icon placeholder */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="w-10 h-10 bg-white/20 rounded-lg backdrop-blur-sm"></div>
              </div>
            </div>

            {/* Welcome text */}
            <div className="text-center mb-8">
              <Text className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Chào mừng bạn!
              </Text>
              <Text className="text-white/80 text-lg leading-relaxed">
                Vui lòng đăng nhập để tiếp tục
                <br />
                <span className="text-sm text-white/60">sử dụng ứng dụng của chúng tôi</span>
              </Text>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 transform animate-in slide-in-from-top duration-300">
                <Box className="bg-red-500/20 border border-red-400/30 backdrop-blur-sm text-red-100 px-4 py-3 rounded-2xl relative" role="alert">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </Box>
              </div>
            )}

            {/* Login button */}
            <div className="space-y-4">
              <Button
                fullWidth
                size="large"
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-semibold py-4 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 ease-out border-0"
                onClick={handleZaloLogin}
                loading={loading}
                disabled={loading}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
                
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      Đang đăng nhập...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Đăng nhập bằng Zalo
                    </>
                  )}
                </span>
              </Button>

              {/* Debug button - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <Button
                  fullWidth
                  size="small"
                  className="bg-gray-600 text-white"
                  onClick={testAccessToken}
                >
                  Debug Access Token
                </Button>
              )}

              {/* Additional options */}
              <div className="text-center">
                <Text className="text-white/60 text-sm">
                  Bằng cách đăng nhập, bạn đồng ý với{" "}
                  <span className="text-blue-300 hover:text-blue-200 cursor-pointer underline decoration-dotted">
                    Điều khoản sử dụng
                  </span>
                </Text>
              </div>
            </div>

            {/* Bottom decoration */}
            <div className="flex justify-center mt-8 space-x-2">
              <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse delay-200"></div>
              <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse delay-400"></div>
            </div>
          </Box>

          {/* Footer text */}
          <div className="text-center mt-8">
            <Text className="text-white/50 text-sm">
              ©2025 Smart Home FPT. All rights reserved.
            </Text>
          </div>
        </div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
    </Page>
  );
};

export default LoginPage;