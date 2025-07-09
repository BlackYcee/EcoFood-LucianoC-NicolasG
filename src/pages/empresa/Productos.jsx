import { useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { deleteProducto } from "../../services/productoService";
import TablaProductos from "../../components/empresa/TablaProductos";
import ModalProductos from "../../components/empresa/ModalProductos";

export default function Productos() {
  const { userData } = useAuth();
  const [busqueda, setBusqueda] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    vencimiento: "",
    id: null
  });

  const handleRefresh = () => {
    setRefreshTick((t) => t + 1);
  };

  const eliminar = useCallback(async (id) => {
    try {
      const confirm = await Swal.fire({
        title: "¿Eliminar producto?",
        showCancelButton: true
      });

      if (confirm.isConfirmed) {
        await deleteProducto(id);
        handleRefresh();
      }
    } catch (e) {
      console.error(e);
      alert("Error al eliminar");
    }
  }, []);

  const abrirModal = (producto = null) => {
    if (producto) {
      setFormData({ ...producto });
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        precio: 0,
        vencimiento: "",
        id: null
      });
    }
    setShowModal(true);
  };

  const [paginaActual, setPaginaActual] = useState(1);
  const [productosPorPagina, setProductosPorPagina] = useState(10);



  return (
    <>
      <div className="container mt-4">
        <div className="row g-4">
          <div className="col-12">
            <h3>Gestión de Productos</h3>
          </div>

          <div className="col"></div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={() => abrirModal()}>
              Agregar Producto
            </button>
          </div>

          <div className="col-12">
            <div className="btn-group" role="group" style={{ width: "100%" }}>
              <input
                className="form-control"
                type="search"
                placeholder="Buscar nombre"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button className="btn btn-outline-success" onClick={handleRefresh}>
                <i className="fa-solid fa-arrows-rotate"></i>
              </button>
            </div>
          </div>

          <div className="col-12 col-md-4 mt-2">
            <label className="form-label">Productos por página</label>
            <select
              className="form-select"
              value={productosPorPagina}
              onChange={(e) => {
                setPaginaActual(1); // volver a la primera página al cambiar cantidad
                setProductosPorPagina(Number(e.target.value));
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>


          <div className="col-12">
            <TablaProductos
              key={refreshTick}
              userData={userData}
              busqueda={busqueda}
              paginaActual={paginaActual}
              productosPorPagina={productosPorPagina}
              eliminar={(id) => eliminar(id)}
              abrirModal={(p) => abrirModal(p)}
            />

            <div className="d-flex justify-content-between align-items-center mt-3">
              <button
                className="btn btn-outline-secondary"
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(paginaActual - 1)}
              >
                ← Anterior
              </button>

              <span>Página {paginaActual}</span>

              <button
                className="btn btn-outline-secondary"
                onClick={() => setPaginaActual(paginaActual + 1)}
              >
                Siguiente →
              </button>
            </div>

          </div>
        </div>
      </div>

      <ModalProductos
        id="productoModal"
        show={showModal}
        setShow={setShowModal}
        userData={userData}
        formData={formData}
        setFormData={setFormData}
        abrirModal={abrirModal}
        handleRefresh={handleRefresh}
      />
    </>
  );
}
