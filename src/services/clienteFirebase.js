import { db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  doc
} from "firebase/firestore";



export const registrarClienteConAuth = async (datos) => {
  try {
    const cred = await createUserWithEmailAndPassword(
      secondaryAuth,
      datos.email,
      datos.password
    );

    await sendEmailVerification(cred.user);

    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nombre: datos.nombre || "",
      comuna: datos.comuna || "",
      direccion: datos.direccion || "",
      tipo: "cliente",
      email: datos.email || ""
    });

    await secondaryAuth.signOut(); // 👈 Evita cerrar sesión del admin
    return cred;
  } catch (error) {
    console.error("Error registrando cliente:", error);
    throw error;
  }
};




/**
 * Obtiene todos los usuarios con tipo "cliente" desde Firestore
 */
export const getClientes = async () => {
  const q = query(collection(db, "usuarios"), where("tipo", "==", "cliente"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Agrega un nuevo cliente a la colección "usuarios"
 * @param {object} clienteData - Información del cliente
 */
export const addCliente = async (clienteData) => {
  return await addDoc(collection(db, "usuarios"), {
    ...clienteData,
    tipo: "cliente",
  });
};

/**
 * Actualiza los datos de un cliente específico
 * @param {string} id - ID del documento del cliente
 * @param {object} clienteData - Nuevos datos a actualizar
 */
export const updateCliente = async (id, clienteData) => {
  const ref = doc(db, "usuarios", id);
  return await updateDoc(ref, clienteData);
};

/**
 * Elimina un cliente de la colección "usuarios"
 * @param {string} id - ID del documento del cliente
 */
export const deleteCliente = async (id) => {
  const ref = doc(db, "usuarios", id);
  return await deleteDoc(ref);
};
