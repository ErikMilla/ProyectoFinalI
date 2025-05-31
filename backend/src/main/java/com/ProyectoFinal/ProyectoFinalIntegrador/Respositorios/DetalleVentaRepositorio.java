package com.ProyectoFinal.ProyectoFinalIntegrador.Respositorios;

import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DetalleVentaRepositorio extends JpaRepository<DetalleVenta, Integer> {
    List<DetalleVenta> findByVenta_IdVenta(int idVenta);
} 