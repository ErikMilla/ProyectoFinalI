package com.ProyectoFinal.ProyectoFinalIntegrador.Respositorios;

import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRespositorio extends JpaRepository<Producto, Integer> {
    
    // Buscar productos por categoría
    List<Producto> findByIdCategoria(int idCategoria);
    
    // Buscar productos por subcategoría
    List<Producto> findByIdSubcategoria(int idSubcategoria);
    
    //  Buscar productos por categoría y subcategoría
    List<Producto> findByIdCategoriaAndIdSubcategoria(int idCategoria, int idSubcategoria);
}