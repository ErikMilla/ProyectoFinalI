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

    public DetalleVenta agregarDetalle(DetalleVenta detalle) {
        return detalleVentaRepositorio.save(detalle);
    }

    public void eliminarDetalle(int idDetalle) {
        detalleVentaRepositorio.deleteById(idDetalle);
    }

    public Venta finalizarVenta(Venta venta) {
        return ventaRepositorio.save(venta);
    }
} 