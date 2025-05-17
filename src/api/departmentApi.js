// src/api/departmentApi.js
import axios from './axiosInstance';
// Gọi tất cả phòng ban
export const fetchAllDepartments = async () => {
  const response = await axios.post('/api/Person/get_department_all', {});
  return response.data;
};
