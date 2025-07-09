import { addProducto, updateProducto } from '../../services/productoService';
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";

export default function ModalProductos({
  show,
  setShow,
  userData,
  handleRefresh,
  formData,
  setFormData
}) {
  const hoyISO = new Date().toISOString().split("T")[0];

  const guardarProducto = async (e) => {
    e.preventDefault();

    // 🔍 Validaciones
    if (!formData.nombre || formData.nombre.trim().length < 3) {
      Swal.fire("Nombre inválido", "Debe tener al menos 3 caracteres", "warning");
      return;
    }

    if (!formData.vencimiento || formData.vencimiento < hoyISO) {
      Swal.fire("Fecha inválida", "El vencimiento no puede ser anterior a hoy", "warning");
      return;
    }

    if (Number(formData.precio) < 0) {
      Swal.fire("Precio inválido", "Debe ser un número positivo", "warning");
      return;
    }

    if (Number(formData.cantidad) <= 0) {
      Swal.fire("Cantidad inválida", "Debe ser al menos 1", "warning");
      return;
    }

    // ⚠️ Alertas
    const diasFaltantes = Math.ceil(
      (new Date(formData.vencimiento) - new Date()) / (1000 * 60 * 60 * 24)
    );

    if (diasFaltantes <= 3) {
      await Swal.fire("Advertencia", "Este producto vence en menos de 3 días", "info");
    }

    if (Number(formData.precio) === 0) {
      await Swal.fire("Info", "Este producto se marcará como gratuito", "info");
    }

    try {
      if (formData.id) {
        await updateProducto(formData.id, formData);
        Swal.fire("Actualizado", "Producto modificado correctamente", "success");
      } else {
        await addProducto({ ...formData, empresaId: userData.uid });
        Swal.fire("Agregado", "Producto creado correctamente", "success");
      }
      setShow(false);
      handleRefresh();
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Ocurrió un error al guardar el producto", "error");
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{formData.id ? "Editar" : "Agregar"} Producto</Modal.Title>
      </Modal.Header>

      <form onSubmit={guardarProducto}>
        <Modal.Body>
          <input
            className="form-control mb-2"
            placeholder="Nombre"
            value={formData.nombre}
            maxLength={30}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
          />
          <textarea
            className="form-control mb-2"
            placeholder="Descripción"
            value={formData.descripcion}
            maxLength={256}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Precio"
            value={formData.precio}
            min={0}
            onChange={(e) =>
              setFormData({ ...formData, precio: Number(e.target.value) })
            }
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Cantidad"
            maxLength={30}
            value={formData.cantidad || ""}
            min={1}
            onChange={(e) =>
              setFormData({ ...formData, cantidad: Number(e.target.value) })
            }
          />
          <input
            type="date"
            className="form-control mb-2"
            value={formData.vencimiento}
            min={hoyISO}
            onChange={(e) =>
              setFormData({ ...formData, vencimiento: e.target.value })
            }
          />
          <select
            className="form-select"
            value={formData.estado}
            onChange={(e) =>
              setFormData({ ...formData, estado: e.target.value })
            }
          >
            <option value="disponible">Disponible</option>
            <option value="agotado">Agotado</option>
            <option value="oculto">Oculto</option>
          </select>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShow(false)}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-success">
            Guardar
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
