import { useEffect, useState } from "react";
import { getProductos } from "../../services/productoService";

export default function TablaProductos({
  userData,
  busqueda,
  estadoFiltro,
  orden,
  limite,
  eliminar,
  abrirModal
}) {
  const [productos, setProductos] = useState([]);

  const cargar = async () => {
    const data = await getProductos(userData.uid); // Asegúrate de filtrar por empresa
    setProductos(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const filtrar = () => {
    const hoy = new Date();
    return productos
      .filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
      .filter((p) => {
        const vencimiento = new Date(p.vencimiento);
        const diff = (vencimiento - hoy) / (1000 * 60 * 60 * 24);
        if (estadoFiltro === "todos") return true;
        if (estadoFiltro === "disponible") return p.estado === "disponible" && diff > 3;
        if (estadoFiltro === "por-vencer") return p.estado === "disponible" && diff <= 3 && diff >= 0;
        if (estadoFiltro === "vencido") return diff < 0;
        return true;
      })
      .sort((a, b) => {
        if (orden === "nombre-asc") return a.nombre.localeCompare(b.nombre);
        if (orden === "nombre-desc") return b.nombre.localeCompare(a.nombre);
        if (orden === "precio-asc") return a.precio - b.precio;
        if (orden === "precio-desc") return b.precio - a.precio;
        return 0;
      })
      .slice(0, limite);
  };

  return (
    <table className="table table-bordered">
      <thead className="table-light">
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Vencimiento</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {filtrar().map((p) => {
          const vencimiento = new Date(p.vencimiento);
          const hoy = new Date();
          const dias = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
          const advertencia =
            dias <= 3 && dias >= 0
              ? "🟠 Por vencer"
              : dias < 0
              ? "🔴 Vencido"
              : "";

          return (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>
                {p.precio === 0 ? (
                  <span className="badge bg-info text-dark">GRATUITO</span>
                ) : (
                  `$${p.precio.toLocaleString()}`
                )}
              </td>
              <td>{p.cantidad}</td>
              <td>
                {p.vencimiento}{" "}
                {advertencia && <span className="ms-2">{advertencia}</span>}
              </td>
              <td>{p.estado}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => abrirModal(p)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminar(p.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
