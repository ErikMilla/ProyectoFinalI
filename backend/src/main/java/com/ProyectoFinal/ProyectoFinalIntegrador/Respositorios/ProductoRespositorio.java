package com.ProyectoFinal.ProyectoFinalIntegrador.Respositorios;

import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRespositorio extends JpaRepository<Producto, Integer> {
    List<Producto> findByIdCategoria(int idCategoria);
} 