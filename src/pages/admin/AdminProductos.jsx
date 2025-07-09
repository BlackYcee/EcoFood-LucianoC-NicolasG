import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getProductos,
  updateProducto,
  deleteProducto,
  addProducto 
} from "../../services/productoService";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [productoActivo, setProductoActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
    imagenUrl: ""
  });

  const cargarProductos = async () => {
    const data = await getProductos();
    setProductos(data);
  };

  const guardar = async () => {
    try {
      if (productoActivo) {
        await updateProducto(productoActivo.id, formData);
        Swal.fire("Actualizado", "Producto actualizado correctamente", "success");
      } else {
        await addProducto (formData);
        Swal.fire("Producto registrado", "Se agregó correctamente.", "success");
      }
      setShowModal(false);
      cargarProductos();
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo guardar el producto", "error");
    }
  };

  const eliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      await deleteProducto(id);
      cargarProductos();
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Panel de Productos</h3>

      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setProductoActivo(null);
          setFormData({
            nombre: "",
            descripcion: "",
            precio: "",
            stock: "",
            categoria: "",
            imagenUrl: ""
          });
          setShowModal(true);
        }}
      >
        Nuevo Producto
      </button>

      <table className="table table-bordered table-hover">
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
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>${p.precio}</td>
              <td>{p.cantidad}</td>
              <td>{p.vencimiento}</td>
              <td>{p.estado}</td>

              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setProductoActivo(p);
                    setFormData({
                      nombre: p.nombre,
                      descripcion: p.descripcion || "",
                      precio: p.precio,
                      stock: p.stock,
                      categoria: p.categoria || "",
                      imagenUrl: p.imagenUrl || ""
                    });
                    setShowModal(true);
                  }}
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
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {productoActivo ? "Editar Producto" : "Nuevo Producto"}
                </h5>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                />
                <input
                  className="form-control mb-2"
                  placeholder="Descripción"
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Precio"
                  value={formData.precio}
                  onChange={(e) =>
                    setFormData({ ...formData, precio: e.target.value })
                  }
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                />
                <input
                  className="form-control mb-2"
                  placeholder="Categoría"
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria: e.target.value })
                  }
                />
                <input
                  className="form-control mb-2"
                  placeholder="URL de imagen"
                  value={formData.imagenUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imagenUrl: e.target.value })
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={guardar}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
