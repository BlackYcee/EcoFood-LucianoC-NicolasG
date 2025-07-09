import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  updateDoc,
  doc
} from "firebase/firestore";

// Crear una nueva solicitud
export const registrarSolicitud = async (solicitud) => {
  await addDoc(collection(db, "solicitudes"), {
    ...solicitud,
    estado: "pendiente",
    fecha: serverTimestamp()
  });
};

// Obtener solicitudes por cliente
export const getSolicitudesPorCliente = async (clienteId) => {
  const q = query(collection(db, "solicitudes"), where("clienteId", "==", clienteId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Confirmar o rechazar desde empresa
export const actualizarEstadoSolicitud = async (solicitudId, estado) => {
  await updateDoc(doc(db, "solicitudes", solicitudId), { estado });
};
