package com.ProyectoFinal.repository;

import com.ProyectoFinal.entity.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {
    Optional<DetalleVenta> findByIdVentaAndIdProducto(Long idVenta, Long idProducto);
    List<DetalleVenta> findByIdVenta(Long idVenta);
} 