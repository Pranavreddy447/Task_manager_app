// frontend/api/auth.ts
import axiosInstance from "./axios";

const TOKEN_KEY = "accessToken";

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("auth/login/", { username: email, email, password });
  const { access, refresh } = response.data;

  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
  return response.data;
};

export const register = async (email: string, password: string) => {
  return await axiosInstance.post("auth/register/", { email, password });
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const refreshToken = async (refresh: string) => {
  return axiosInstance.post('/auth/token/refresh/', { refresh });
};

export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};
