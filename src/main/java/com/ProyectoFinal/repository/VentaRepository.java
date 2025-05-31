package com.ProyectoFinal.repository;

import com.ProyectoFinal.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VentaRepository extends JpaRepository<Venta, Long> {
    Optional<Venta> findByIdUsuarioAndEstado(Long idUsuario, String estado);
} 