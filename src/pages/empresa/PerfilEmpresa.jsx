import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import Swal from "sweetalert2";

export default function PerfilEmpresa() {
  const { userData } = useAuth();
  const [formData, setFormData] = useState({
    nombre: userData?.nombre || "",
    comuna: userData?.comuna || "",
    direccion: userData?.direccion || "",
    telefono: userData?.telefono || ""
  });
  const [editando, setEditando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const guardarCambios = async () => {
    try {
      await updateDoc(doc(db, "empresas", userData.uid), formData);
      Swal.fire("Guardado", "Perfil actualizado correctamente", "success");
      setEditando(false);
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el perfil", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Perfil de Empresa</h3>

      <div className="mb-3">
        <label className="form-label"><strong>Nombre</strong></label>
        <input
          className="form-control"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          disabled={!editando}
        />
      </div>

      <div className="mb-3">
        <label className="form-label"><strong>Email</strong></label>
        <input
          className="form-control"
          value={userData?.email || ""}
          disabled
        />
      </div>

      <div className="mb-3">
        <label className="form-label"><strong>Comuna</strong></label>
        <input
          className="form-control"
          name="comuna"
          value={formData.comuna}
          onChange={handleChange}
          disabled={!editando}
        />
      </div>

      <div className="mb-3">
        <label className="form-label"><strong>Dirección</strong></label>
        <input
          className="form-control"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          disabled={!editando}
        />
      </div>

      <div className="mb-3">
        <label className="form-label"><strong>Teléfono</strong></label>
        <input
          className="form-control"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          disabled={!editando}
        />
      </div>

      {editando ? (
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={guardarCambios}>
            Guardar cambios
          </button>
          <button className="btn btn-secondary" onClick={() => setEditando(false)}>
            Cancelar
          </button>
        </div>
      ) : (
        <button className="btn btn-primary" onClick={() => setEditando(true)}>
          Editar perfil
        </button>
      )}
    </div>
  );
}
