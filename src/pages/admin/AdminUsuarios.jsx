import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getClientes,
  updateCliente,
  deleteCliente,
  registrarClienteConAuth,
} from "../../services/clienteFirebase";

export default function AdminUsuarios() {
  const [clientes, setClientes] = useState([]);
  const [clienteActivo, setClienteActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    comuna: "",
    direccion: "",
    telefono: "",
    tipo: "cliente",
    password: "",
  });

  const cargarClientes = async () => {
    const data = await getClientes();
    setClientes(data);
  };

  const guardar = async () => {
    try {
      if (clienteActivo) {
        await updateCliente(clienteActivo.id, formData);
      } else {
        if (!formData.password || formData.password.length < 6) {
          Swal.fire(
            "Contraseña inválida",
            "La contraseña debe tener al menos 6 caracteres.",
            "warning"
          );
          return;
        }
        await registrarClienteConAuth(formData);
        Swal.fire("Cliente registrado", "Se envió un correo de verificación.", "success");
      }
      setShowModal(false);
      cargarClientes();
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo registrar el cliente", "error");
    }
  };

  const eliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar cliente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
    });

    if (result.isConfirmed) {
      await deleteCliente(id);
      cargarClientes();
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Clientes Registrados</h3>

      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setClienteActivo(null);
          setFormData({
            nombre: "",
            email: "",
            comuna: "",
            direccion: "",
            telefono: "",
            tipo: "cliente",
            password: "",
          });
          setShowModal(true);
        }}
      >
        Nuevo Cliente
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Comuna</th>
            <th>Teléfono</th>
            <th>Tipo</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.email}</td>
              <td>{c.comuna}</td>
              <td>{c.telefono}</td>
              <td>{c.tipo}</td>
              <td>{c.direccion}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setClienteActivo(c);
                    setFormData({
                      nombre: c.nombre,
                      email: c.email,
                      comuna: c.comuna,
                      direccion: c.direccion || "",
                      telefono: c.telefono || "",
                      tipo: c.tipo || "cliente",
                      password: "",
                    });
                    setShowModal(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminar(c.id)}
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
                  {clienteActivo ? "Editar Cliente" : "Nuevo Cliente"}
                </h5>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nombre"
                  value={formData.nombre}
                  maxLength={30}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                />
                <input
                  type="email"
                  className="form-control mb-2"
                  placeholder="Email"
                  value={formData.email}
                  maxLength={254}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <input
                  className="form-control mb-2"
                  placeholder="Comuna"
                  value={formData.comuna}
                  maxLength={30}
                  onChange={(e) =>
                    setFormData({ ...formData, comuna: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 12) {
                      setFormData({ ...formData, telefono: value });
                    }
                  }}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Dirección"
                  value={formData.direccion}
                  maxLength={30}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                />
                {!clienteActivo && (
                  <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Contraseña (mínimo 6 caracteres)"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                )}
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
