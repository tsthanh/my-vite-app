import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function DepartmentDetail() {
  const location = useLocation();
  const navigate = useNavigate(); // để điều hướng lại nếu thiếu state

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [departmentInfo, setDepartmentInfo] = useState(location.state);

  useEffect(() => {
    // Nếu không có location.state, chuyển về lại trang danh sách
    if (!departmentInfo) {
      setError("Không có thông tin phòng ban, quay lại danh sách.");
      setTimeout(() => navigate('/'), 2000); // Quay lại sau 2 giây
      return;
    }

    const { Department_Serial_Key, Department_Serial_Keys } = departmentInfo;

    const payload = {
      department_Serial_Key: Department_Serial_Key || "",
      department_Serial_Keys: Department_Serial_Keys || ""
    };

    console.log("🚀 Gửi API:", payload);
    console.log("📦 Department_Serial_Keys type:", typeof Department_Serial_Keys, Department_Serial_Keys);


    fetch('https://192.168.30.101:8090/api/Person/get_person_department', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then(text => {
        if (!text) throw new Error("Phản hồi rỗng từ API");
        const parsed = JSON.parse(text);
        const result = parsed?.data ?? parsed;
        if (!Array.isArray(result)) throw new Error("Kết quả không phải là mảng");
        console.log(result);
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error:', err);
        setError(err.message || 'Lỗi không xác định');
        setLoading(false);
      });
  }, [departmentInfo]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: 'red' }}>Lỗi: {error}</p>;

  return (
  <div>
    <h2>Danh sách nhân viên</h2>
      <button
        onClick={() => navigate('/')}
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
        ← Quay lại danh sách phòng ban
      </button>
    <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead style={{ backgroundColor: '#f0f0f0' }}>
        <tr>
          <th>ID</th>
          <th>Họ tên</th>
          <th>Tuổi</th>
          <th>Chức vụ</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {data.map((person) => (
          <tr
            key={person.person_ID}
            onClick={() => navigate(`/employee-detail/${person.person_ID}`)}

            style={{ cursor: 'pointer' }}
          >
            <td>{person.person_ID ?? ''}</td>
            <td>{person.person_Name ?? 'Không tên'}</td>
            <td>{person.age ?? 'N/A'}</td>
            <td>{typeof person.position_ID === 'object' ? '[Đối tượng]' : person.position_ID ?? 'N/A'}</td>
            <td>{person.person_Status ?? 'N/A'}</td>
          </tr>
        ))}
      </tbody>

    </table>
  </div>
);
}

export default DepartmentDetail;
