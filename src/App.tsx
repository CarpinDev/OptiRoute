import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { DashboardLayout } from './components/DashboardLayout';
import { AdminDashboard } from './components/AdminDashboard';
import { EmployeesPage } from './components/EmployeesPage';
import { VehiclesPage } from './components/VehiclesPage';
import { PlanRoutePage } from './components/PlanRoutePage';
import { GeneratedRoutePage } from './components/GeneratedRoutePage';
import { DriverView } from './components/DriverView';
import { EmployeeView } from './components/EmployeeView';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="empleados" element={<EmployeesPage />} />
          <Route path="vehiculos" element={<VehiclesPage />} />
          <Route path="planificar-ruta" element={<PlanRoutePage />} />
          <Route path="ruta-generada" element={<GeneratedRoutePage />} />
        </Route>
        <Route path="/conductor" element={<DriverView />} />
        <Route path="/empleado" element={<EmployeeView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
