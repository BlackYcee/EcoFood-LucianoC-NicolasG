import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

export default function CerrarSesion() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <button className="btn btn-danger" onClick={handleLogout}>
      Cerrar Sesión
    </button>
  );
}
