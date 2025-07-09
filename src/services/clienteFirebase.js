import { db, secondaryAuth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
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
  setDoc
} from "firebase/firestore";

// 🔐 Crear administrador con Auth + guardar en colección "admin"
export const registrarAdministradorConAuth = async (datos) => {
  const cred = await createUserWithEmailAndPassword(
    secondaryAuth,
    datos.email,
    datos.password
  );

  await sendEmailVerification(cred.user);

  await setDoc(doc(db, "admin", cred.user.uid), {
    nombre: datos.nombre || "",
    comuna: datos.comuna || "",
    direccion: datos.direccion || "",
    telefono: datos.telefono || "",
    tipo: "admin",
    email: datos.email || ""
  });

  await secondaryAuth.signOut();
  return cred;
};

// 🔄 Actualizar y eliminar administradores
export const updateAdministrador = async (id, adminData) => {
  const ref = doc(db, "admin", id);
  return await updateDoc(ref, adminData);
};

export const deleteAdministrador = async (id) => {
  const ref = doc(db, "admin", id);
  return await deleteDoc(ref);
};

// 📥 Obtener administradores
export const getAdministradores = async () => {
  const snapshot = await getDocs(collection(db, "admin"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 📥 Clientes
export const getClientes = async () => {
  const q = query(collection(db, "usuarios"), where("tipo", "==", "cliente"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addCliente = async (clienteData) => {
  return await addDoc(collection(db, "usuarios"), {
    ...clienteData,
    tipo: "cliente"
  });
};

export const registrarClienteConAuth = async (datos) => {
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

  await secondaryAuth.signOut();
  return cred;
};

// 📥 Empresas
export const getEmpresas = async () => {
  const snapshot = await getDocs(collection(db, "empresas"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addEmpresa = async (empresaData) => {
  return await addDoc(collection(db, "empresas"), {
    ...empresaData,
    tipo: "empresa"
  });
};

export const deleteEmpresa = async (id) => {
  const ref = doc(db, "empresas", id);
  return await deleteDoc(ref);
};

export const updateCliente = async (id, clienteData) => {
  const ref = doc(db, "usuarios", id);
  return await updateDoc(ref, clienteData);
};

export const deleteCliente = async (id) => {
  const ref = doc(db, "usuarios", id);
  return await deleteDoc(ref);
};
