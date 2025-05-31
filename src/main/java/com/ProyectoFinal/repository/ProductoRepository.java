package com.ProyectoFinal.repository;

import com.ProyectoFinal.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
} 