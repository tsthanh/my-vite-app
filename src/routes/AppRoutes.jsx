// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DepartmentList from '../components/DepartmentList';
import DepartmentDetail from '../components/DepartmentDetail';
import EmployeeDetail from '../components/EmployeeDetail';
import withErrorBoundary from '../hoc/withErrorBoundary';

const routes = [
  { path: '/', component: DepartmentList },
  { path: '/department-detail', component: DepartmentDetail },
  { path: '/employee-detail/:id', component: EmployeeDetail }
];

const AppRoutes = () => (
  <Routes>
    {routes.map(({ path, component: Component }) => (
      <Route
        key={path}
        path={path}
        element={withErrorBoundary(Component)()}
      />
    ))}
  </Routes>
);


export default AppRoutes;
