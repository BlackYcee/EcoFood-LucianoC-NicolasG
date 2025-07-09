import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getEmpresas,
  updateCliente,
  deleteEmpresa
} from "../../services/clienteFirebase";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db, secondaryAuth } from "../../services/firebase";

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [empresaActiva, setEmpresaActiva] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rut: "",
    comuna: "",
    direccion: "",
    telefono: "",
    tipo: "empresa",
    password: ""
  });

  const cargarEmpresas = async () => {
    const data = await getEmpresas();
    const soloEmpresas = data.filter((u) => u.tipo === "empresa");
    setEmpresas(soloEmpresas);
  };

  const registrarEmpresaConAuth = async (datos) => {
    const cred = await createUserWithEmailAndPassword(
      secondaryAuth,
      datos.email,
      datos.password
    );

    await sendEmailVerification(cred.user);

    await setDoc(doc(db, "empresas", cred.user.uid), {
      nombre: datos.nombre || "",
      comuna: datos.comuna || "",
      direccion: datos.direccion || "",
      telefono: datos.telefono || "",
      tipo: "empresa",
      email: datos.email || ""
    });

    await secondaryAuth.signOut(); // Para evitar cerrar sesión del admin
  };

  const guardar = async () => {
    // Validaciones
    if (formData.nombre.length < 3 || formData.nombre.length > 50) {
      Swal.fire("Nombre inválido", "Debe tener entre 3 y 50 caracteres", "warning");
      return;
    }

    if (!formData.email.includes("@") || formData.email.length < 10) {
      Swal.fire("Email inválido", "Debe contener un @ y tener al menos 10 caracteres", "warning");
      return;
    }

    if (!/^\+\d{9,15}$/.test(formData.telefono)) {
      Swal.fire("Teléfono inválido", "Debe comenzar con '+' seguido de 9 a 15 dígitos", "warning");
      return;
    }

    if (formData.comuna.length > 60) {
      Swal.fire("Comuna muy larga", "Máximo 60 caracteres", "warning");
      return;
    }

    if (formData.direccion.length > 60) {
      Swal.fire("Dirección muy larga", "Máximo 60 caracteres", "warning");
      return;
    }

    if (!empresaActiva && formData.password.length < 6) {
      Swal.fire("Contraseña inválida", "Debe tener al menos 6 caracteres", "warning");
      return;
    }

    try {
      if (empresaActiva) {
        const { password, ...resto } = formData;
        await updateCliente(empresaActiva.id, resto);
        Swal.fire("Actualizado", "Empresa actualizada correctamente", "success");
      } else {
        await registrarEmpresaConAuth(formData);
        Swal.fire("Creado", "Empresa creada exitosamente. Se ha enviado un correo de verificación", "success");
      }

      setShowModal(false);
      cargarEmpresas();
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo procesar la acción", "error");
    }
  };

  const eliminar = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar empresa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar"
    });

    if (resultado.isConfirmed) {
      await deleteEmpresa(id); // si tienes deleteEmpresa, úsalo aquí
      cargarEmpresas();
    }
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Empresas Registradas</h3>

      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setEmpresaActiva(null);
          setFormData({
            nombre: "",
            email: "",
            rut: "",
            comuna: "",
            direccion: "",
            telefono: "",
            tipo: "empresa",
            password: ""
          });
          setShowModal(true);
        }}
      >
        Nueva Empresa
      </button>

      {/* Tabla */}
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rut</th>
            <th>Comuna</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((e) => (
            <tr key={e.id}>
              <td>{e.nombre}</td>
              <td>{e.email}</td>
              <td>{e.rut}</td>
              <td>{e.comuna}</td>
              <td>{e.telefono}</td>
              <td>{e.direccion}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setEmpresaActiva(e);
                    setFormData({
                      nombre: e.nombre,
                      email: e.email,
                      rut: e.rut,
                      comuna: e.comuna,
                      direccion: e.direccion || "",
                      telefono: e.telefono || "",
                      tipo: e.tipo || "empresa",
                      password: ""
                    });
                    setShowModal(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminar(e.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {empresaActiva ? "Editar Empresa" : "Nueva Empresa"}
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
                  maxLength={64}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <input
                  type="rut"
                  className="form-control mb-2"
                  placeholder="RUT"
                  value={formData.rut}
                  maxLength={12}
                  onChange={(e) =>
                    setFormData({ ...formData, rut: e.target.value })
                  }
                />
                {!empresaActiva && (
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
                  maxLength={60}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  maxLength={60}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Teléfono (con +)"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
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
