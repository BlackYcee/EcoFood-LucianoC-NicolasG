import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAdministradores,
  registrarAdministradorConAuth,
  updateAdministrador,
  deleteAdministrador
} from "../../services/clienteFirebase";

export default function AdminAdministradores() {
  const [admins, setAdmins] = useState([]);
  const [adminActivo, setAdminActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    comuna: "",
    direccion: "",
    telefono: "",
    tipo: "admin",
    password: ""
  });

  const cargarAdministradores = async () => {
    const data = await getAdministradores();
    const soloAdmins = data.filter((u) => u.tipo === "admin");
    setAdmins(soloAdmins);
  };

  const guardar = async () => {
  if (!formData.nombre || formData.nombre.length < 3) {
    Swal.fire("Nombre inválido", "Debe tener al menos 3 caracteres", "warning");
    return;
  }
  if (!formData.email.includes("@")) {
    Swal.fire("Email inválido", "Debe contener un @", "warning");
    return;
  }
  if (!adminActivo && formData.password.length < 6) {
    Swal.fire("Contraseña inválida", "Debe tener mínimo 6 caracteres", "warning");
    return;
  }

  try {
    if (adminActivo) {
      const { password, ...resto } = formData;
      await updateAdministrador(adminActivo.id, resto);
      Swal.fire("Actualizado", "Administrador actualizado correctamente", "success");
    } else {
      await registrarAdministradorConAuth(formData);
      Swal.fire("Creado", "Administrador registrado y verificación enviada", "success");
    }
    setShowModal(false);
    cargarAdministradores();
  } catch (error) {
    Swal.fire("Error", error.message || "No se pudo guardar", "error");
  }
  };

  const eliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar administrador?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar"
    });

    if (confirm.isConfirmed) {
      await deleteAdministrador(id);
      cargarAdministradores();
    }
  };

  useEffect(() => {
    cargarAdministradores();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Administradores Registrados</h3>

      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setAdminActivo(null);
          setFormData({
            nombre: "",
            email: "",
            comuna: "",
            direccion: "",
            telefono: "",
            tipo: "admin",
            password: ""
          });
          setShowModal(true);
        }}
      >
        Nuevo Administrador
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Comuna</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a.id}>
              <td>{a.nombre}</td>
              <td>{a.email}</td>
              <td>{a.comuna}</td>
              <td>{a.telefono}</td>
              <td>{a.direccion}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setAdminActivo(a);
                    setFormData({
                      nombre: a.nombre,
                      email: a.email,
                      comuna: a.comuna,
                      direccion: a.direccion || "",
                      telefono: a.telefono || "",
                      tipo: a.tipo || "admin",
                      password: ""
                    });
                    setShowModal(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminar(a.id)}
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
                  {adminActivo ? "Editar Administrador" : "Nuevo Administrador"}
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
                  type="email"
                  className="form-control mb-2"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {!adminActivo && (
                  <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Contraseña (mín. 6 caracteres)"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                )}
                <input
                  className="form-control mb-2"
                  placeholder="Comuna"
                  value={formData.comuna}
                  onChange={(e) =>
                    setFormData({ ...formData, comuna: e.target.value })
                  }
                />
                <input
                  className="form-control mb-2"
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                />
                <input
                  className="form-control mb-2"
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={(e) => {
                    const valor = e.target.value;
                    if (/^\d*$/.test(valor) && valor.length <= 12) {
                      setFormData({ ...formData, telefono: valor });
                    }
                  }}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
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
