import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getClientes,
  updateCliente,
  deleteCliente
} from "../../services/clienteFirebase";

export default function AdminEmpresas() {
  const [admins, setAdmins] = useState([]);
  const [adminActivo, setAdminActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    comuna: "",
    direccion: "",
    telefono: "",
    tipo: "admin"
  });

  const cargarEmpresa = async () => {
    const data = await getClientes();
    const soloEmpresas = data.filter((u) => u.tipo === "empresa");
    setAdmins(soloEmpresas);

  };

  const guardar = async () => {
    try {
      if (adminActivo) {
        await updateCliente(adminActivo.id, formData);
        Swal.fire("Actualizado", "Empresa actualizada correctamente", "success");
      }
      setShowModal(false);
      cargarEmpresa();
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo actualizar", "error");
    }
  };

  const eliminar = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar empresa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (resultado.isConfirmed) {
      await deleteCliente(id);
      cargarEmpresa();
    }
  };

  useEffect(() => {
    cargarEmpresa();
  }, []);
  return (
    <div className="container mt-4">
      <h3>Empresas Registradas</h3>

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
            tipo: "empresa"
          });
          setShowModal(true);
        }}
      >
        Nueva Empresa
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
                      tipo: a.tipo || "empresa"
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
                  {adminActivo ? "Editar Empresa" : "Nueva Empresa"}
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
