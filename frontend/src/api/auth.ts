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

export const registration = async (email: string, password: string) => {
  return await axiosInstance.post("auth/register/", { username: email, email, password });
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login"; // Redirect to login page after logout
};

export const refreshToken = async (refresh: string) => {
  return axiosInstance.post('/auth/token/refresh/', { refresh });
};

export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};
