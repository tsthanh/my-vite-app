import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPersonById } from '../api/employeeDetailApi';

const EmployeeDetail = () => {
  const { id } = useParams();  // lấy id từ route param
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    if (id) {
      fetchPersonById(id)  // truyền trực tiếp id (string hoặc số)
        .then(data => {
          console.log("🔍 Dữ liệu từ API:", data); // Thêm dòng này
          if (Array.isArray(data) && data.length > 0) {
            setEmployee(data[0]);
          } else {
            setEmployee(null);
          }
        })
        .catch(err => {
          console.error('Error fetching person detail:', err);
          setEmployee(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) return <p>Đang tải thông tin nhân viên...</p>;
  if (!employee) return <p>Không tìm thấy nhân viên.</p>;

  return (
    <div style={{ padding: '16px' }}>
      <h2>Chi tiết nhân viên</h2>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: '16px',
          padding: '8px 12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Quay lại
      </button>

      <button onClick={() => setRotate((prev) => prev + 90)}>Xoay ảnh</button>
      <img
        src={`data:image/jpeg;base64,${employee.person_Image}`}
        alt="Ảnh nhân viên"
        style={{
          maxWidth: '200px',
          borderRadius: '8px',
          transform: `rotate(${rotate}deg)`,
          transition: 'transform 0.3s ease'
        }}
        onError={(e) => { e.target.style.display = 'none'; }}
      />

      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr><th>Person_ID</th><td>{employee.person_ID}</td></tr>
          <tr><th>Person Name</th><td>{employee.person_Name}</td></tr>
          <tr><th>Gender</th><td>{employee.gender}</td></tr>
          <tr><th>Birthday</th><td>{employee.birthday}</td></tr>
          <tr><th>ID</th><td>{employee.id}</td></tr>
          <tr><th>Hire Date</th><td>{employee.date_Come_In}</td></tr>
          <tr><th>Date Off</th><td>{employee.date_Work_End}</td></tr>
          <tr><th>Status</th><td>{employee.person_Status}</td></tr>
          <tr><th>Department</th><td>{employee.department_Name}</td></tr>
          <tr><th>Position</th><td>{employee.position_Name}</td></tr>
          <tr><th>Address</th><td>{employee.address_Live}</td></tr>
          <tr><th>Staying</th><td>{employee.staying_Addres}</td></tr>
          <tr><th>Mobilephone</th><td>{employee.mobilephone_Number}</td></tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDetail;
