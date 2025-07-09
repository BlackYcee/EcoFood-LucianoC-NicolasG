import { useEffect, useState } from "react";
import { getProductosDisponibles } from "../../services/productoService";
import { registrarSolicitud } from "../../services/solicitudService";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

export default function ClienteProductos() {
  const { userData } = useAuth();
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    const cargar = async () => {
      const disponibles = await getProductosDisponibles();
      setProductos(disponibles);
    };
    cargar();
  }, []);

  const handleCantidadChange = (productoId, cantidad) => {
    if (/^\d*$/.test(cantidad)) {
      setCantidades((prev) => ({
        ...prev,
        [productoId]: cantidad
      }));
    }
  };

  const solicitar = async (producto) => {
    const cantidad = parseInt(cantidades[producto.id], 10);
    
    if (!cantidad || cantidad < 1) {
      Swal.fire("Cantidad inválida", "Debes ingresar una cantidad válida", "warning");
      return;
    }

    if (cantidad > producto.stock) {
      Swal.fire("Stock insuficiente", "No puedes solicitar más de lo disponible", "error");
      return;
    }

    try {
      await registrarSolicitud({
        productoId: producto.id,
        clienteId: userData.uid,
        empresaId: producto.empresaId,
        cantidad
      });

      Swal.fire("Solicitud enviada", "Tu solicitud se registró como pendiente", "success");
      setCantidades((prev) => ({ ...prev, [producto.id]: "" }));
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo registrar la solicitud", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Productos Disponibles</h3>
      <ul className="list-group mt-3">
        {productos.map((p) => (
          <li key={p.id} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div>
              <strong>{p.nombre}</strong> – Stock: {p.stock} – Precio: ${p.precio || 0}
            </div>
            <div className="d-flex mt-2 mt-md-0 align-items-center">
              <input
                type="number"
                placeholder="Cantidad"
                min={1}
                max={p.stock}
                className="form-control me-2"
                style={{ width: "100px" }}
                value={cantidades[p.id] || ""}
                onChange={(e) => handleCantidadChange(p.id, e.target.value)}
              />
              <button className="btn btn-primary" onClick={() => solicitar(p)}>
                Solicitar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
