import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { AuthContext } from "./AuthContext";
import { getUserData } from "../services/userService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);         // Usuario de Firebase Auth
  const [userData, setUserData] = useState(null); // Datos desde Firestore
  const [loading, setLoading] = useState(true);   // Indicador de carga inicial

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          const data = await getUserData(firebaseUser.uid);
          data.uid = firebaseUser.uid;
          if (data?.tipo) {
            setUserData(data);
          } else {
            console.warn("Usuario autenticado sin rol asignado");
            setUser(null);
            setUserData(null);
            auth.signOut(); // opcional: forzar logout si no tiene datos válidos
          }

        } catch (error) {
          console.error("Error al obtener datos del usuario desde Firestore:", error);
          setUser(null);
          setUserData(null);
        }

      } else {
        setUser(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup
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
