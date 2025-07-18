import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isAuthenticated as checkAuth, clearTokens } from "../services/auth";
import api from "../services/api";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await api.post("/auth/login", credentials);
          if (response.data.success) {
            const userResponse = await api.get("/auth/me");
            if (userResponse.data.success && userResponse.data.resident) {
              set({
                user: userResponse.data.resident,
                isAuthenticated: true,
                isLoading: false,
              });
              // Lưu email vào localStorage
              localStorage.setItem(
                "userEmail",
                userResponse.data.resident.email || ""
              );
            } else {
              set({
                user: {
                  email: credentials.email,
                  role: "USER",
                },
                isAuthenticated: true,
                isLoading: false,
              });
              localStorage.setItem("userEmail", credentials.email || "");
            }
          } else {
            set({ isLoading: false });
          }
          return response;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        clearTokens();
        localStorage.removeItem("auth-storage");
        localStorage.removeItem("userEmail");
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      fetchCurrentUser: async () => {
        if (checkAuth()) {
          try {
            const response = await api.get("/auth/me");
            if (response.data.success && response.data.resident) {
              set({ user: response.data.resident });
              localStorage.setItem(
                "userEmail",
                response.data.resident.email || ""
              );
            } else {
              clearTokens();
              localStorage.removeItem("userEmail");
              set({
                user: null,
                isAuthenticated: false,
              });
            }
          } catch {
            clearTokens();
            localStorage.removeItem("userEmail");
            set({
              user: null,
              isAuthenticated: false,
            });
          }
        }
      },

      syncAuth: async () => {
        try {
          const authed = checkAuth();
          set({ isAuthenticated: authed });

          if (authed) {
            const response = await api.get("/auth/me");
            if (response.data.success && response.data.resident) {
              set({ user: response.data.resident });
              localStorage.setItem(
                "userEmail",
                response.data.resident.email || ""
              );
            } else {
              clearTokens();
              localStorage.removeItem("userEmail");
              set({
                user: null,
                isAuthenticated: false,
              });
            }
          } else {
            set({ user: null });
            localStorage.removeItem("userEmail");
          }
        } catch {
          clearTokens();
          localStorage.removeItem("userEmail");
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
