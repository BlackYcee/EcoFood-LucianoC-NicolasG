import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ProtectedRoute from "../routes/ProtectedRoute";
import RecuperarContraseña from "../pages/RecuperarContraseña";
import ProtectedByRole from "../routes/ProtectedByRole";

// Cliente
import ClienteDashboard from '../pages/cliente/ClienteDashboard';
import ClienteProductos from "../pages/cliente/ClienteProductos";
import ClienteSolicitudes from "../pages/cliente/ClienteSolicitudes";


// Admin
import AdminLayout from '../pages/admin/layout/AdminLayout';
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProductos from '../pages/admin/AdminProductos';
import AdminUsuarios from '../pages/admin/AdminUsuarios';
import AdminAdministradores from '../pages/admin/AdminAdministradores';
import AdminEmpresas from '../pages/admin/AdminEmpresas';

// Empresa
import PerfilEmpresa from '../pages/empresa/PerfilEmpresa';
import EmpresaLayout from '../pages/empresa/layout/EmpresaLayout'; // me estoy volviendo loco 
import Productos from "../pages/empresa/Productos";


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
        }>
          <Route path="dashboard" element={<ClienteDashboard />} />
          <Route path="productos" element={<ClienteProductos />} />
          <Route path="solicitudes" element={<ClienteSolicitudes />} />
        </Route>

      

      <Route path="/empresa" element={
        <ProtectedByRole allowed={["empresa"]}>
          <EmpresaLayout />
        </ProtectedByRole>
      }>
        <Route path="perfil" element={<PerfilEmpresa />} />
        <Route path="productos" element={<Productos />} />
      </Route>





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
