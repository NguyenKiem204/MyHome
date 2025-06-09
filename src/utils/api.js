// src/utils/api.js - API interceptor để tự động refresh token
import axios from 'axios';
import { getValidToken, clearTokens, setAccessToken } from './auth';

// Tạo axios instance
const api = axios.create({
  baseURL: 'https://harmless-right-chipmunk.ngrok-free.app/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - tự động thêm Bearer token
api.interceptors.request.use(
  async (config) => {
    // Không cần gọi getValidToken ở đây, vì logic refresh sẽ nằm trong response interceptor
    // Chỉ lấy token hiện có từ AuthManager
    const authManager = (await import('./auth')).default; // Lấy instance AuthManager
    const accessToken = authManager.getAccessToken(); // Lấy token từ AuthManager

    if (accessToken && !authManager.isTokenExpired()) { // Chỉ thêm nếu token còn hạn
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/api/auth/refresh') {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const authManager = (await import('./auth')).default;
        const refreshResponse = await axios.post('https://harmless-right-chipmunk.ngrok-free.app/api/auth/refresh', {}, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        });

        if (refreshResponse.data.success) {
          const { accessToken, expiresIn } = refreshResponse.data.data;
          
          authManager.setAccessToken(accessToken, expiresIn);
          
          processQueue(null, accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          // Refresh token thành công nhưng phản hồi không đúng format hoặc success=false
          clearTokens(); // Xóa tất cả token
          if (typeof window !== 'undefined') {
            window.location.href = '/login'; // Chuyển hướng về login
          }
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        // Refresh token thất bại hoàn toàn (server trả 401, 403, network error...)
        clearTokens(); // Xóa tất cả token
        processQueue(refreshError); // Thông báo lỗi cho các request đang chờ
        if (typeof window !== 'undefined') {
          window.location.href = '/login'; // Chuyển hướng về login
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Nếu lỗi không phải 401 hoặc là request đã thử lại
    return Promise.reject(error);
  }
);

export default api;