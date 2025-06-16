// Axios instance with error interceptor
import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});


api.interceptors.response.use(
  (res) => res,
  (error) => {
    toast.error(error.response?.data?.detail || 'Error');
    return Promise.reject(error);
  },
);

export default api;
