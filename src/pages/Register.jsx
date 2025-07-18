import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";

export default function Register() {
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rut, setRut] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      password.length < 6 ||
      !/\d/.test(password) ||
      !/[a-zA-Z]/.test(password)
    ) {
      Swal.fire(
        "Contraseña débil",
        "Usa al menos 6 caracteres que combinen letras y números.",
        "warning"
      );
      return;
    }

    if (!tipoUsuario) {
      Swal.fire("Error", "Selecciona el tipo de usuario", "error");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);

      const userData = {
        uid: cred.user.uid,
        nombre,
        email,
        tipo: tipoUsuario,
        comuna,
        direccion,
        telefono,
        ...(tipoUsuario === "empresa" ? { rut } : {}),
      };

      await setDoc(doc(db, "usuarios", cred.user.uid), userData);

      Swal.fire(
        "Registro exitoso",
        "Hemos enviado un correo de verificación. Revisa tu bandeja de entrada antes de iniciar sesión.",
        "info"
      );

      navigate("/login");
    } catch (error) {
      console.error("Código de error:", error.code);
      console.error("Mensaje:", error.message);
      Swal.fire("Error", "No se pudo completar el registro", "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Tipo de usuario</label>
          <select
            className="form-select"
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
            required
          >
            <option value="cliente">Cliente</option>
            <option value="empresa">Empresa</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            maxLength={64}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={64}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            maxLength={64}
          />
        </div>

        {tipoUsuario === "cliente" && (
          <>
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
                placeholder="Ej: Av falsa 123"
                maxLength={100}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Comuna</label>
              <input
                type="text"
                className="form-control"
                value={comuna}
                onChange={(e) => setComuna(e.target.value)}
                required
                placeholder="Ej: La Serena"
                maxLength={64}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                className="form-control"
                value={telefono}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 12) {
                    setTelefono(value);
                  }
                }}
                placeholder="Ej: 987654321"
                maxLength={12}
              />
            </div>
          </>
        )}

        {tipoUsuario === "empresa" && (
          <>
            <div className="mb-3">
              <label className="form-label">RUT</label>
              <input
                type="text"
                className="form-control"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                required
                placeholder="Ej: 76.123.456-7"
                maxLength={12}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Comuna</label>
              <input
                type="text"
                className="form-control"
                value={comuna}
                onChange={(e) => setComuna(e.target.value)}
                required
                placeholder="Ej: La Serena"
                maxLength={64}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
                placeholder="Ej: Av empresa 456"
                maxLength={100}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                className="form-control"
                value={telefono}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 12) {
                    setTelefono(value);
                  }
                }}
                placeholder="Ej: 987654321"
                maxLength={12}
              />
            </div>
          </>
        )}

        <p className="mt-2">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>

        <button type="submit" className="btn btn-success">Registrarse</button>
      </form>
    </div>
  );
}
