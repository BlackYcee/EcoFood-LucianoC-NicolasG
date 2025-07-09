import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Busca un documento de usuario por UID en varias colecciones posibles.
 * Orden: usuarios → empresas → admin
 * @param {string} uid - ID del usuario autenticado
 * @returns {Promise<object>} - Los datos del usuario encontrados
 */
export const getUserData = async (uid) => {
  try {
    const colecciones = ["usuarios", "empresas", "admin"];

    for (const nombre of colecciones) {
      const ref = doc(db, nombre, uid);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) return snapshot.data();
    }

    throw new Error("Usuario no encontrado en Firestore");
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    throw error;
  }
};

/**
 * Guarda los datos completos del usuario en una colección específica
 * @param {string} uid - ID del usuario
 * @param {object} data - Información del usuario: {nombre, email, tipo, direccion, comuna, telefono}
 * @param {string} coleccion - Nombre de la colección (por defecto: "usuarios")
 */
export const saveUserData = async (uid, data, coleccion = "usuarios") => {
  try {
    await setDoc(doc(db, coleccion, uid), data);
  } catch (error) {
    console.error("Error al guardar usuario en Firestore:", error);
    throw error;
  }
};
