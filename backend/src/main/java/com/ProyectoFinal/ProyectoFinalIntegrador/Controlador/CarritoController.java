package com.ProyectoFinal.ProyectoFinalIntegrador.Controlador;

import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.Venta;
import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.DetalleVenta;
import com.ProyectoFinal.ProyectoFinalIntegrador.Servicio.VentaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    // Clase interna para la solicitud de agregar detalle
    static class AgregarDetalleRequest {
        private int idVenta;
        private int id_producto;
        private int cantidad;

        // Getters y Setters
        public int getIdVenta() {
            return idVenta;
        }

        public void setIdVenta(int idVenta) {
            this.idVenta = idVenta;
        }

        public int getId_producto() {
            return id_producto;
        }

        public void setId_producto(int id_producto) {
            this.id_producto = id_producto;
        }

        public int getCantidad() {
            return cantidad;
        }

        public void setCantidad(int cantidad) {
            this.cantidad = cantidad;
        }
    }

    @Autowired
    private VentaServicio ventaServicio;

    // Endpoint para obtener el carrito activo
    @GetMapping("/activo/{idUsuario}")
    public ResponseEntity<?> obtenerCarritoActivo(@PathVariable int idUsuario) {
        Venta carrito = ventaServicio.obtenerCarritoActivo(idUsuario);
        if (carrito == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No active cart found for this user.");
        }
        return ResponseEntity.ok(carrito);
    }

    // Endpoint para crear un nuevo carrito (usado cuando no hay uno activo)
    @PostMapping
    public Venta crearCarrito(@RequestBody Map<String, Integer> body) {
        int idUsuario = body.get("idUsuario");
        return ventaServicio.crearCarrito(idUsuario);
    }

    // Endpoint para agregar un detalle a un carrito existente
    @PostMapping("/detalle")
    public DetalleVenta agregarDetalle(@RequestBody AgregarDetalleRequest request) {
        DetalleVenta nuevoDetalle = new DetalleVenta();
        nuevoDetalle.setId_producto(request.getId_producto());
        nuevoDetalle.setCantidad(request.getCantidad());

        return ventaServicio.agregarDetalle(request.getIdVenta(), nuevoDetalle);
    }

    // Eliminar producto del carrito
    @DeleteMapping("/detalle/{idDetalle}")
    public void eliminarDetalle(@PathVariable int idDetalle) {
        ventaServicio.eliminarDetalle(idDetalle);
    }

    // Endpoint para aumentar la cantidad de un detalle
    @PutMapping("/detalle/{idDetalle}/aumentar")
    public DetalleVenta aumentarCantidadDetalle(@PathVariable int idDetalle, @RequestBody DetalleVenta detalleActualizado) {
        // La nueva cantidad viene en el body del request
        int nuevaCantidad = detalleActualizado.getCantidad();
        // En este caso, el frontend ya envía la cantidad actualizada, no necesitamos el idVenta aquí
        return ventaServicio.actualizarCantidadDetalle(idDetalle, nuevaCantidad);
    }

    // Endpoint para disminuir la cantidad de un detalle
    @PutMapping("/detalle/{idDetalle}/disminuir")
    public ResponseEntity<?> disminuirCantidadDetalle(@PathVariable int idDetalle, @RequestBody DetalleVenta detalleActualizado) {
        int nuevaCantidad = detalleActualizado.getCantidad();
        if (nuevaCantidad <= 0) {
            // Si la cantidad es 0 o menos, eliminar el detalle
            ventaServicio.eliminarDetalle(idDetalle);
            return ResponseEntity.ok().build(); // Devolver respuesta exitosa sin contenido
        } else {
            // Si la cantidad es mayor que 0, actualizar la cantidad
            DetalleVenta detalleModificado = ventaServicio.actualizarCantidadDetalle(idDetalle, nuevaCantidad);
            if (detalleModificado != null) {
                 return ResponseEntity.ok(detalleModificado);
            } else {
                 return ResponseEntity.notFound().build(); // Manejar caso donde el detalle no se encuentra
            }
        }
    }

    // Finalizar compra
    @PostMapping("/{idUsuario}/finalizar")
    public Venta finalizarCompra(@PathVariable int idUsuario, @RequestBody Venta venta) {
        // Aquí puedes calcular el total y marcar la venta como finalizada
        return ventaServicio.finalizarVenta(venta);
    }

    // Obtener detalles del carrito
    @GetMapping("/detalles/{idVenta}")
    public List<DetalleVenta> obtenerDetalles(@PathVariable int idVenta) {
        return ventaServicio.obtenerDetallesPorVenta(idVenta);
    }

    // Vaciar carrito (eliminar todos los productos del carrito)
    @DeleteMapping("/{idVenta}/vaciar")
    public ResponseEntity<?> vaciarCarrito(@PathVariable int idVenta) {
        ventaServicio.vaciarCarrito(idVenta);
        return ResponseEntity.ok().build();
    }
} 