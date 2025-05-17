import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://192.168.30.101:8090',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Optional: Interceptors để log lỗi
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server phản hồi lỗi, có thể lấy data chi tiết
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request đã gửi nhưng không nhận được phản hồi (network lỗi)
      console.error('No response received:', error.request);
    } else {
      // Lỗi khi cấu hình request hoặc lỗi khác
      console.error('Error', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
