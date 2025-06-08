import React from 'react';
import '../css/MiniCarrito.css'; // Corrected path

const MiniCarrito = ({ isVisible, onClose, carrito, detalles, total, handleDisminuirCantidad, handleAumentarCantidad, eliminarDetalle, finalizarCompra }) => {
  if (!isVisible) {
    return null; // No renderizar si no está visible
  }

  return (
    <div className="mini-carrito-overlay" onClick={onClose}>
      <div className="mini-carrito-container" onClick={(e) => e.stopPropagation()}> {/* Evitar que el clic dentro cierre el modal */}
        <div className="mini-carrito-header">
          <h3>Tu Carrito</h3>
          <button className="mini-carrito-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="mini-carrito-body">
          {detalles.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            <ul className="mini-carrito-items">
              {detalles.map((item) => (
                <li key={item.id_detalle} className="mini-carrito-item">
                  <div className="item-info">
                    <span>{item.producto ? item.producto.nombre : 'Producto'}</span>
                    <span className="item-price">S/{item.producto && item.producto.precio ? parseFloat(item.producto.precio).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="item-quantity-controls">
                    <button onClick={() => handleDisminuirCantidad(item.id_detalle, item.cantidad)} disabled={item.cantidad <= 1}>-</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => handleAumentarCantidad(item.id_detalle, item.cantidad)}>+</button>
                  </div>
                  <button className="item-remove-btn" onClick={() => eliminarDetalle(item.id_detalle)}>Eliminar</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mini-carrito-footer">
          <div className="mini-carrito-total">
            <strong>Total:</strong> <span>S/{total ? total.toFixed(2) : '0.00'}</span>
          </div>
          {detalles.length > 0 && (
            <button className="mini-carrito-finalizar-btn" onClick={finalizarCompra}>Finalizar Compra</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniCarrito; 