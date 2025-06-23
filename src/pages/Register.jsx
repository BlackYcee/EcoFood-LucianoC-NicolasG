import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import { saveUserData } from "../services/userService";

export default function RegisterCliente() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");

  const tipo = "cliente";
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.length < 6 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      Swal.fire(
        "Contraseña débil",
        "Usa al menos 6 caracteres que combinen letras y números.",
        "warning"
      );
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await sendEmailVerification(cred.user);


      await saveUserData(cred.user.uid, {
        nombre,
        email,
        tipo,
        direccion,
        comuna,
        telefono,
      });

      Swal.fire(
        "Registro exitoso",
        "Hemos enviado un correo de verificación. Revisa tu bandeja de entrada antes de iniciar sesión.",
        "info"
      );

      navigate("/login");
    } catch (error) {
      console.error("Código de error:", error.code);
      console.error("Mensaje:", error.message);
      Swal.fire("Error", error.message, "error");
      Swal.fire("Error", "No se pudo completar el registro", "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro - Cliente</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
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
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono (opcional)</label>
          <input
            type="tel"
            className="form-control"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo de usuario</label>
          <input
            type="text"
            className="form-control"
            value={tipo}
            readOnly
          />
        </div>

        <p className="mt-2">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>

        <button type="submit" className="btn btn-success">
          Registrarse
        </button>
      </form>
    </div>
  );
}
