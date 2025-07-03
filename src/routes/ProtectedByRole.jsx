import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedByRole({ allowed, children }) {
  const { user, userData, loading } = useContext(AuthContext);

  if (loading) return <div>Cargando...</div>;
  if (!user || !userData) return <Navigate to="/login" />;

  if (!allowed.includes(userData.tipo)) {
    return <Navigate to="/home" />;
  }

  return children;
}
