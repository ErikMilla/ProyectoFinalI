package com.ProyectoFinal.ProyectoFinalIntegrador.Servicio;

import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.Venta;
import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.DetalleVenta;
import com.ProyectoFinal.ProyectoFinalIntegrador.Respositorios.VentaRepositorio;
import com.ProyectoFinal.ProyectoFinalIntegrador.Respositorios.DetalleVentaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VentaServicio {
    @Autowired
    private VentaRepositorio ventaRepositorio;
    @Autowired
    private DetalleVentaRepositorio detalleVentaRepositorio;

    public Venta obtenerCarritoActivo(int idUsuario) {
        return ventaRepositorio.findByIdUsuarioAndTotalIsNull(idUsuario);
    }

    public Venta crearCarrito(int idUsuario) {
        Venta venta = new Venta();
        venta.setIdUsuario(idUsuario);
        venta.setTotal(null); // Carrito activo
        return ventaRepositorio.save(venta);
    }

    public List<DetalleVenta> obtenerDetallesPorVenta(int idVenta) {
        return detalleVentaRepositorio.findByVenta_IdVenta(idVenta);
    }

    public DetalleVenta agregarDetalle(int idVenta, DetalleVenta detalle) {
        int idProducto = detalle.getId_producto();

        DetalleVenta existente = detalleVentaRepositorio.findByVentaAndProducto(idVenta, idProducto);

        if (existente != null) {
            existente.setCantidad(existente.getCantidad() + detalle.getCantidad());
            return detalleVentaRepositorio.save(existente);
        } else {
            Venta venta = ventaRepositorio.findById(idVenta)
                                        .orElseThrow(() -> new RuntimeException("Venta not found"));
            detalle.setVenta(venta);
            return detalleVentaRepositorio.save(detalle);
        }
    }

    public void eliminarDetalle(int idDetalle) {
        detalleVentaRepositorio.deleteById(idDetalle);
    }

    public DetalleVenta actualizarCantidadDetalle(int idDetalle, int cantidad) {
        return detalleVentaRepositorio.findById(idDetalle)
                .map(detalle -> {
                    detalle.setCantidad(cantidad);
                    return detalleVentaRepositorio.save(detalle);
                })
                .orElse(null); // O manejar el caso de que no exista el detalle
    }

    public Venta finalizarVenta(Venta venta) {
        return ventaRepositorio.save(venta);
    }
} 