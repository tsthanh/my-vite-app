import React, { useEffect, useState } from 'react';
import { fetchAllDepartments } from '../api/departmentApi';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await fetchAllDepartments();

        // Gán _uid cho từng item (dùng để key React)
        const departmentsWithUid = data.map(dept => ({
          ...dept,
          _uid: uuidv4()
        }));

        setDepartments(departmentsWithUid);
      } catch (error) {
        console.error('Lỗi khi tải phòng ban:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  // Nhóm departments theo department_Serial_Key
  const groupedDepartments = (departments || []).reduce((acc, dept) => {
    const key = dept.department_Serial_Key;
    if (!acc[key]) acc[key] = [];
    acc[key].push(dept);
    return acc;
  }, {});

  const handleRowClick = (department) => {
    const serialKeys = department.department_Serial_Keys;
    const serialKey = department.department_Serial_Key;
    navigate('/department-detail', {
      state: {
        Department_Serial_Key: serialKeys && serialKeys.trim() !== "" ? "" : serialKey,  // nếu null hoặc undefined thì truyền ""
        Department_Serial_Keys: serialKeys
      }
    });
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  if (!departments.length) return <p>Không có dữ liệu phòng ban</p>;

  return (
    <div>
      <h2>Danh sách phòng ban</h2>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#ddd' }}>
            <th>Department Name</th>
            <th>Working</th>
            <th>NoWorking</th>
            <th>Male</th>
            <th>Female</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedDepartments).map(([serialKey, group]) => {
            const departmentName = group[0]?.department_Name || 'Không rõ';
            const displayName = departmentName.split('(')[0].trim();

            return (
              <React.Fragment key={serialKey}>
                <tr style={{ backgroundColor: '#eee', fontWeight: 'bold' }}>
                  <td colSpan={5}>
                    Phòng ban: {displayName} (Có {group.length} bộ phận)
                  </td>
                </tr>
                {group.map(dept => (
                  <tr
                    key={dept._uid}
                    onClick={() => handleRowClick(dept)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{dept.department_Name}</td>
                    <td>{dept.working}</td>
                    <td>{dept.noWorking}</td>
                    <td>{dept.male}</td>
                    <td>{dept.female}</td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentList;
