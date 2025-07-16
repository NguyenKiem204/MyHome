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
            } else {
              set({
                user: {
                  email: credentials.email,
                  role: "USER",
                },
                isAuthenticated: true,
                isLoading: false,
              });
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
            } else {
              clearTokens();
              set({
                user: null,
                isAuthenticated: false,
              });
            }
          } catch {
            clearTokens();
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
            } else {
              clearTokens();
              set({
                user: null,
                isAuthenticated: false,
              });
            }
          } else {
            set({ user: null });
          }
        } catch {
          clearTokens();
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
