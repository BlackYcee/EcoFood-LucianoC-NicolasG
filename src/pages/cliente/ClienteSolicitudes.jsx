import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getSolicitudesPorCliente } from "../../services/solicitudService";
import { getProductos } from "../../services/productoService";

export default function ClienteSolicitudes() {
  const { userData } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [productosMap, setProductosMap] = useState({});

  useEffect(() => {
    const cargar = async () => {
      const lista = await getSolicitudesPorCliente(userData.uid);
      setSolicitudes(lista);

      // Cargar productos relacionados
      const todos = await getProductos();
      const productosPorId = {};
      todos.forEach((p) => {
        productosPorId[p.id] = p;
      });
      setProductosMap(productosPorId);
    };
    cargar();
  }, [userData]);

  const obtenerNombreProducto = (id) => productosMap[id]?.nombre || "Desconocido";
  const colorEstado = (estado) => {
    if (estado === "aceptada") return "success";
    if (estado === "rechazada") return "danger";
    return "secondary";
  };

  return (
    <div className="container mt-4">
      <h3>Mis Solicitudes</h3>
      <ul className="list-group mt-3">
        {solicitudes.map((s) => (
          <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{obtenerNombreProducto(s.productoId)}</strong><br />
              Cantidad: {s.cantidad}
            </div>
            <span className={`badge bg-${colorEstado(s.estado)} rounded-pill text-capitalize`}>
              {s.estado}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
