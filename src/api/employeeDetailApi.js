// src/api/employeeDetailApi.js
import axios from './axiosInstance';
// Gọi chi tiết theo ID
export const fetchPersonById = async (personId) => {
  const payload = { Person_ID: personId };
  console.log("📤 Payload gửi lên API:", payload);  // 👈 thêm dòng này
  const response = await axios.post('/api/Person/get_person_id', payload);
  return response.data;
};

