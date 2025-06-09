import axios from 'axios'; // Dùng axios trực tiếp cho refresh token, không phải instance 'api'

class AuthManager {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken') || null;
    this.tokenExpirationTime = localStorage.getItem('tokenExpirationTime') 
      ? parseInt(localStorage.getItem('tokenExpirationTime')) 
      : null;
  }

  setAccessToken(token, expiresIn) { 
    this.accessToken = token;
    this.tokenExpirationTime = Date.now() + (expiresIn * 1000); 
    
    localStorage.setItem('accessToken', token);
    localStorage.setItem('tokenExpirationTime', this.tokenExpirationTime.toString());
  }

  getAccessToken() {
    if (this.accessToken && !this.isTokenExpired()) {
      return this.accessToken;
    }
    const storedToken = localStorage.getItem('accessToken');
    const storedExpirationTime = localStorage.getItem('tokenExpirationTime');

    if (storedToken && storedExpirationTime) {
      this.accessToken = storedToken;
      this.tokenExpirationTime = parseInt(storedExpirationTime);
      if (!this.isTokenExpired()) {
        return this.accessToken;
      }
    }
    return null;
  }

  isTokenExpired() {
    if (!this.tokenExpirationTime) return true;
    return Date.now() >= this.tokenExpirationTime;
  }

  isAuthenticated() {
    const token = this.getAccessToken();
    return token !== null;
  }

  clearTokens() {
    this.accessToken = null;
    this.tokenExpirationTime = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenExpirationTime');
    // Khi logout, cũng gửi yêu cầu backend để xóa refresh token (tùy chọn nhưng nên làm)
    // api.post('/auth/logout', {}, { withCredentials: true }).catch(err => console.error("Logout failed", err));
  }

  // Hàm này sẽ được gọi bởi ProtectedRoute
  async refreshTokenIfNeeded() {
    if (this.isAuthenticated()) {
      return true; 
    }
    try {
      const refreshResponse = await axios.post(
        'https://harmless-right-chipmunk.ngrok-free.app/api/auth/refresh', 
        {},
        { 
          withCredentials: true, // Quan trọng để gửi HttpOnly cookie
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

      if (refreshResponse.status === 200 && refreshResponse.data.success) {
        const { accessToken, expiresIn } = refreshResponse.data.data;
        this.setAccessToken(accessToken, expiresIn);
        return true;
      }
      this.clearTokens();
      return false;
    } catch (error) {
      console.error('Refresh token failed:', error);
      this.clearTokens();
      return false;
    }
  }
}

const authManager = new AuthManager();

export const isAuthenticated = () => authManager.isAuthenticated();
export const setAccessToken = (token, expiresIn) => authManager.setAccessToken(token, expiresIn);
export const getAccessToken = () => authManager.getAccessToken();
export const clearTokens = () => authManager.clearTokens();
export const refreshTokenIfNeeded = () => authManager.refreshTokenIfNeeded();

export default authManager;