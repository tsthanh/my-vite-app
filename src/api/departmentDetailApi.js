// src/api/departmentDetailApi.js
import axios from './axiosInstance';

export const fetchDepartments = async (params) => {
  const response = await axios.post('/api/Person/get_person_department', {
    data: params, // 👈 thêm key 'data' bọc quanh params
  });
  return response.data;
};
