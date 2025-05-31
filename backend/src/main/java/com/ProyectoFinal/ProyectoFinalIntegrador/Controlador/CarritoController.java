package com.ProyectoFinal.ProyectoFinalIntegrador.Controlador;

import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.Venta;
import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.DetalleVenta;
import com.ProyectoFinal.ProyectoFinalIntegrador.Servicio.VentaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {
    @Autowired
    private VentaServicio ventaServicio;

    // Obtener el carrito actual del usuario
    @GetMapping("/{idUsuario}")
    public Venta obtenerCarrito(@PathVariable int idUsuario) {
        return ventaServicio.obtenerCarritoActivo(idUsuario);
    }

    // Agregar producto al carrito
    @PostMapping("/{idUsuario}/agregar")
    public DetalleVenta agregarProducto(@PathVariable int idUsuario, @RequestBody DetalleVenta detalle) {
        Venta carrito = ventaServicio.obtenerCarritoActivo(idUsuario);
        if (carrito == null) {
            carrito = ventaServicio.crearCarrito(idUsuario);
        }
        detalle.setVenta(carrito);
        return ventaServicio.agregarDetalle(detalle);
    }

    // Eliminar producto del carrito
    @DeleteMapping("/detalle/{idDetalle}")
    public void eliminarDetalle(@PathVariable int idDetalle) {
        ventaServicio.eliminarDetalle(idDetalle);
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
} 