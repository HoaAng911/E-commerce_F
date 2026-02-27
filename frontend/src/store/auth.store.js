import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import authApi from '../api/auth.service';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      error: null,
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      // Đăng ký
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(userData);
          set({ isLoading: false })
          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Đăng ký thất bại',
            isLoading: false
          });
          throw error;
        }
      },
      
      // Đăng nhập
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(credentials);
          const { access_token, user } = response.data;
          
          set({
            user,
            accessToken: access_token,
            isLoading: false,
            error: null
          });
          
          return response.data;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Đăng nhập thất bại',
            isLoading: false
          });
          throw error;
        }
      },
      
      // Lấy thông tin profile
      getProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.getProfile();
          const userProfile = response.data;
          
          // Cập nhật thông tin user trong store
          set({
            user: { ...get().user, ...userProfile },
            isLoading: false
          });
          
          return userProfile;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Không thể lấy thông tin profile',
            isLoading: false
          });
          throw error;
        }
      },
      
      // Cập nhật profile
      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.updateProfile(profileData);
          const updatedProfile = response.data;
          
          // Cập nhật thông tin user trong store
          set({
            user: { ...get().user, ...updatedProfile },
            isLoading: false
          });
          
          return updatedProfile;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Cập nhật profile thất bại',
            isLoading: false
          });
          throw error;
        }
      },
      
      // Đổi mật khẩu
      changePassword: async (passwordData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.changePassword(passwordData);
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Đổi mật khẩu thất bại',
            isLoading: false
          });
          throw error;
        }
      },
      
      // Refresh token (tự động gọi khi token hết hạn)
      refreshToken: async () => {
        try {
          const response = await authApi.refreshToken();
          const { access_token } = response.data;
          
          set({
            accessToken: access_token
          });
          
          return access_token;
        } catch (error) {
          // Nếu refresh thất bại, đăng xuất
          get().logout();
          throw error;
        }
      },
      
      // Đăng xuất
      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            accessToken: null,
            error: null
          });
        }
      },
      
      // Cập nhật thông tin user trong store
      setUser: (userData) => {
        set({
          user: { ...get().user, ...userData }
        });
      },
      
      isAuthenticated: () => {
        return !!get().accessToken && !!get().user;
      },
      
      currentUser: () => get().user,
      
      getToken: () => get().accessToken,
      
      reset: () => set({
        user: null,
        accessToken: null,
        isLoading: false,
        error: null
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken
      }),
    }
  )
);

export default useAuthStore;