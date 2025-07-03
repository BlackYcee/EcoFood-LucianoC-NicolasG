import { db } from "./firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";

const coleccion = collection(db, "productos");

export const getProductos = async () => {
  const snapshot = await getDocs(coleccion);
  return snapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() }));
};

export const registrarProducto = async (productoData) => {
  await addDoc(coleccion, productoData);
};

export const updateProducto = async (id, data) => {
  const ref = doc(db, "productos", id);
  await updateDoc(ref, data);
};

export const deleteProducto = async (id) => {
  const ref = doc(db, "productos", id);
  await deleteDoc(ref);
};
