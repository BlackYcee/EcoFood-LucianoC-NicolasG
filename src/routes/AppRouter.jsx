import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ProtectedRoute from "../routes/ProtectedRoute";
import RecuperarContraseña from "../pages/RecuperarContraseña";
import ProtectedByRole from "../routes/ProtectedByRole";

// Cliente
import ClienteDashboard from '../pages/cliente/ClienteDashboard';

// Admin
import AdminLayout from '../pages/admin/layout/AdminLayout';
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProductos from '../pages/admin/AdminProductos';
import AdminUsuarios from '../pages/admin/AdminUsuarios';
import AdminAdministradores from '../pages/admin/AdminAdministradores';
import AdminEmpresas from '../pages/admin/AdminEmpresas';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/mainecofood.html" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar" element={<RecuperarContraseña />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/cliente/dashboard" element={
        <ProtectedByRole allowed={["cliente"]}>
          <ClienteDashboard />
        </ProtectedByRole>
      } />
      <Route path="/admin" element={
        <ProtectedByRole allowed={["admin"]}>
          <AdminLayout />
        </ProtectedByRole>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="usuarios" element={<AdminUsuarios />} />
        <Route path="administradores" element={<AdminAdministradores />} />
        <Route path="empresas" element={<AdminEmpresas />} />
      </Route>
    </Routes>
  );
}
