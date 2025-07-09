import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  startAt,
  endAt,
  startAfter,
  limit,
  getCountFromServer
} from "firebase/firestore";

export const PAGE_SIZE = 5;

// Añadir producto 
export const addProducto = async (producto) => {
  const ref = doc(collection(db, "productos")); // genera nuevo ID
  const productoConId = { ...producto, id: ref.id };
  await setDoc(ref, productoConId);
};

// Eliminar producto
export const deleteProducto = async (id) => {
  await deleteDoc(doc(db, "productos", id));
};

// Actualizar producto
export const updateProducto = async (id, data) => {
  const ref = doc(db, "productos", id);
  await updateDoc(ref, data);
};

// literalmente obtiene productos dependiendo de la empresa
export const obtenerProductosEmpresa = async (empresaId, opciones = {}) => {
  const { nombre = "", cursor = null, limite = 10 } = opciones;
  const productosRef = collection(db, "productos");

  let q = query(
    productosRef,
    where("empresaId", "==", empresaId),
    orderBy("nombre"),
    startAt(nombre),
    endAt(nombre + "\uf8ff"),
    limit(limite)
  );

  if (cursor) {
    q = query(
      productosRef,
      where("empresaId", "==", empresaId),
      orderBy("nombre"),
      startAt(nombre),
      endAt(nombre + "\uf8ff"),
      startAfter(cursor),
      limit(limite)
    );
  }

  const snapshot = await getDocs(q);
  const productos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return { productos, lastVisible };
};

// Contar productos por empresa + búsqueda
export const obtenerTotalProductos = async (empresaId, busqueda = "") => {
  const productosRef = collection(db, "productos");

  let q = query(productosRef, where("empresaId", "==", empresaId));

  if (busqueda.trim() !== "") {
    const term = busqueda.toLowerCase();
    q = query(
      productosRef,
      where("empresaId", "==", empresaId),
      orderBy("nombre"),
      startAt(term),
      endAt(term + "\uf8ff")
    );
  }

  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};

// Obtener todos los productos (opcional)
export const getProductos = async () => {
  const snapshot = await getDocs(collection(db, "productos"));
  return snapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() }));
};

// Obtener productos con stock disponible
export const getProductosDisponibles = async () => {
  const q = query(collection(db, "productos"), where("stock", ">", 0));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
