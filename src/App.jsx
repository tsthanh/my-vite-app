// src/App.jsx
import React from 'react';
import AppRoutes from './routes/AppRoutes'; // bỏ ./../ cho gọn

const App = () => {
  return (
    <div className="container">
      <h1>Quản lý Nhân viên & Phòng ban</h1>
      <AppRoutes />
    </div>
  );
};

export default App;
