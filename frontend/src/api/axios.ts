// frontend/api/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add Authorization header if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Try refreshing token if 401 is returned
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('refreshToken');
    

    // Prevent infinite loop
    if (
      [401,403].includes(error.response?.status) &&
      refreshToken &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const response = await axios.post('http://localhost:8000/api/auth/token/refresh/', {
          refresh: refreshToken,
        });
        const newAccess = response.data.access;
        localStorage.setItem('accessToken', newAccess);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
        return axiosInstance(originalRequest); // retry the original request
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Optionally redirect to login
        window.location.replace("/tasks");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
