import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Obtiene los datos del usuario desde Firestore
 * @param {string} uid - ID del usuario (auth.uid)
 */
export const getUserData = async (uid) => {
  try {
    const ref = doc(db, "usuarios", uid);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      throw new Error("Usuario no encontrado en Firestore");
    }
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    throw error;
  }
};

/**
 * Guarda los datos completos del usuario en Firestore
 * @param {string} uid
 * @param {object} data - {nombre, email, tipo, direccion, comuna, telefono}
 */
export const saveUserData = async (uid, data) => {
  try {
    await setDoc(doc(db, "usuarios", uid), data);
  } catch (error) {
    console.error("Error al guardar usuario en Firestore:", error);
    throw error;
  }
};
