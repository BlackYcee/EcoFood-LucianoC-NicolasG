import { Outlet, Link } from "react-router-dom";


export default function EmpresaLayout() {
  return (
    <div className="container mt-3">
      <h2>Panel de Empresa</h2>
      <nav className="mb-3">
        <Link to="/empresa/perfil" className="btn btn-outline-primary me-2">Perfil</Link>
        <Link to="/empresa/productos" className="btn btn-outline-primary me-2">Productos</Link>
        
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}
