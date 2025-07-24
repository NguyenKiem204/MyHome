import React, { useState, useEffect } from "react";
import { Page, Box, Text, Button, Input } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import { getAccessToken } from "zmp-sdk/apis";
import axios from "axios";
import { isAuthenticated, setAccessToken } from "../services/auth";
import { LOGIN_URL } from "../constants/api";
import { getPhoneNumber } from "zmp-sdk/apis";

const API_BASE_URL = "https://hip-grouper-star.ngrok-free.app";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessTokenState] = useState("");
  const [verifyingPhone, setVerifyingPhone] = useState(false);

  // 1. Đăng nhập bằng Zalo
  const handleZaloLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Bắt đầu gọi getAccessToken...");
      const tokenResponse = await getAccessToken({});
      const accessToken = tokenResponse;
      console.log("Access Token:", accessToken);
      setAccessTokenState(accessToken);
      if (!accessToken || accessToken.trim() === "") {
        setError("Không thể lấy access token từ Zalo. Vui lòng thử lại.");
        setLoading(false);
        return;
      }
      // Gửi accessToken lên server
      const response = await axios.post(
        "https://hip-grouper-star.ngrok-free.app/api/resident/login-zalo",
        {
          accessToken: accessToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      console.log("Kết quả gọi API login:", response.data);
      if (response.data.needPhoneVerify) {
        setAccessTokenState(accessToken);
        setVerifyingPhone(true);
      } else if (response.data.success) {
        setAccessToken(response.data.jwt, 3000);
        navigate("/", { replace: true });
      } else {
        setError(response.data.message || "Đăng nhập thất bại.");
      }
    } catch (err) {
      setError("Lỗi đăng nhập.");
      console.error("Lỗi trong handleZaloLogin:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Xác thực số điện thoại tự động bằng Zalo
  useEffect(() => {
    if (verifyingPhone && accessToken) {
      setError(null);
      setLoading(false);
      console.log("Đang xác thực số điện thoại qua Zalo...");
      getPhoneNumber()
        .then((res) => {
          console.log("Lấy số điện thoại thành công:", res.token);
          if (res && res.token) {
            axios
              .post(
                "https://hip-grouper-star.ngrok-free.app/api/auth/verify-phone",
                { zaloPhoneToken: res.token, accessToken },
                {
                  headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                  },
                }
              )
              .then((response) => {
                console.log("Kết quả xác thực số điện thoại:", response.data);
                if (response.data.success) {
                  setAccessToken(response.data.jwt, 3000);
                  navigate("/", { replace: true });
                } else {
                  console.log("Lỗi xác thực số điện thoại:", response.data);
                  setError(
                    response.data.message || "Xác thực số điện thoại thất bại."
                  );
                  setVerifyingPhone(false);
                }
              })
              .catch((err) => {
                console.log("Lỗi xác thực số điện thoại:", err);
                setError("Lỗi xác thực số điện thoại." + err);
                setVerifyingPhone(false);
              });
          } else {
            setError("Không lấy được token số điện thoại từ Zalo.");
            setVerifyingPhone(false);
          }
        })
        .catch((err) => {
          setError("Lấy số điện thoại từ Zalo thất bại." + err);
          setVerifyingPhone(false);
        });
    }
  }, [verifyingPhone, accessToken]);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <Page className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 animate-bounce delay-1000"></div>
      <div
        className="absolute top-32 right-16 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg rotate-45 opacity-30 animate-spin delay-2000"
        style={{ animationDuration: "8s" }}
      ></div>
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
                <span className="text-sm text-white/60">
                  sử dụng ứng dụng của chúng tôi
                </span>
              </Text>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6">
                <Box
                  className="bg-red-500/20 border border-red-400/30 text-red-100 px-4 py-3 rounded-2xl"
                  role="alert"
                >
                  <span className="text-sm font-medium">{error}</span>
                </Box>
              </div>
            )}
            {/* Đang xác thực số điện thoại */}
            {verifyingPhone ? (
              <div className="flex flex-col items-center space-y-4">
                <Text className="text-white text-lg">
                  Đang xác thực số điện thoại Zalo...
                </Text>
                <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <Button
                fullWidth
                size="large"
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white font-semibold py-4 rounded-2xl shadow-xl"
                onClick={handleZaloLogin}
                loading={loading}
                disabled={loading}
              >
                Đăng nhập bằng Zalo
              </Button>
            )}
          </Box>

          {/* Bottom decoration */}
          <div className="flex justify-center mt-8 space-x-2">
            <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse delay-200"></div>
            <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse delay-400"></div>
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
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>
    </Page>
  );
};

export default LoginPage;
