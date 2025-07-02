import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { AuthContext } from "./AuthContext"; // Asegúrate de tener este archivo separado
import { getUserData } from "../services/userService"; // Este módulo debe contener tu lógica para leer Firestore

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Usuario de Firebase Auth
  const [userData, setUserData] = useState(null); // Datos adicionales desde Firestore
  const [loading, setLoading] = useState(true); // Indicador de carga inicial

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const data = await getUserData(firebaseUser.uid);
          if (!data || !data.tipo) {
            console.warn("El usuario está autenticado pero no tiene datos completos.");
            setUserData({ tipo: "invitado" }); // O decide qué hacer
          } else {
            setUserData(data);
          }
        } catch (error) {
          console.error("Error al cargar datos del usuario:", error);
          setUserData(null); // Evita propagar errores al contexto
        }

      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Cargando autenticación...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
