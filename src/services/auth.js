import axios from "axios";
import { REFRESH_URL } from "../constants/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FULL_REFRESH_URL = `${API_BASE_URL}${REFRESH_URL}`;

class AuthManager {
  constructor() {
    this.accessToken = localStorage.getItem("accessToken") || null;
    this.tokenExpirationTime = localStorage.getItem("tokenExpirationTime")
      ? parseInt(localStorage.getItem("tokenExpirationTime"))
      : null;
  }

  setAccessToken(token, expiresIn) {
    this.accessToken = token;
    this.tokenExpirationTime = Date.now() + expiresIn * 1000;
    localStorage.setItem("accessToken", token);
    localStorage.setItem(
      "tokenExpirationTime",
      this.tokenExpirationTime.toString()
    );
  }

  getAccessToken() {
    if (this.accessToken && !this.isTokenExpired()) {
      return this.accessToken;
    }
    const storedToken = localStorage.getItem("accessToken");
    const storedExpirationTime = localStorage.getItem("tokenExpirationTime");
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

  shouldRefreshToken() {
    if (!this.tokenExpirationTime) return false;
    const oneMinuteFromNow = Date.now() + 1 * 60 * 1000;
    return this.tokenExpirationTime <= oneMinuteFromNow;
  }

  isAuthenticated() {
    const token = this.getAccessToken();
    return token !== null;
  }

  clearTokens() {
    this.accessToken = null;
    this.tokenExpirationTime = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenExpirationTime");
  }
}

const authManager = new AuthManager();

export const isAuthenticated = () => authManager.isAuthenticated();
export const setAccessToken = (token, expiresIn) =>
  authManager.setAccessToken(token, expiresIn);
export const clearTokens = () => authManager.clearTokens();

export const refreshTokenIfNeeded = async () => {
  if (authManager.isAuthenticated()) {
    return true;
  }
  try {
    const refreshResponse = await axios.post(
      FULL_REFRESH_URL,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (refreshResponse.status === 200 && refreshResponse.data.success) {
      const { accessToken, expiresIn } = refreshResponse.data.data;
      authManager.setAccessToken(accessToken, expiresIn);
      return true;
    }
    authManager.clearTokens();
    return false;
  } catch (error) {
    console.error("Refresh token failed:", error);
    authManager.clearTokens();
    return false;
  }
};

export default authManager;
