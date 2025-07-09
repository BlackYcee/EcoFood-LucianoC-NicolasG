import { Outlet, Link } from "react-router-dom";

export default function ClienteLayout() {
  return (
    <div className="container mt-4">
      <h2 className="mb-3">Bienvenido a tu perfil de cliente</h2>

      <nav className="mb-4">
        <Link to="/cliente/productos" className="btn btn-outline-primary me-2">
          Ver Productos
        </Link>
        <Link to="/cliente/solicitudes" className="btn btn-outline-primary me-2">
          Mis Solicitudes
        </Link>
        <Link to="/cliente/perfil" className="btn btn-outline-secondary">
          Mi Perfil
        </Link>
      </nav>

      <hr />

      {/* Aquí se renderiza cada vista hija según la ruta activa */}
      <Outlet />
    </div>
  );
}
