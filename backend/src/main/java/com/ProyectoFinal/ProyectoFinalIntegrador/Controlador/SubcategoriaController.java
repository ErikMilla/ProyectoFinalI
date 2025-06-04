package com.ProyectoFinal.ProyectoFinalIntegrador.Controlador;

import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.Subcategoria;
import com.ProyectoFinal.ProyectoFinalIntegrador.Respositorios.SubcategoriaRespositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/subcategorias")
@CrossOrigin(origins = "http://localhost:3000")
public class SubcategoriaController {

    @Autowired
    private SubcategoriaRespositorio subcategoriaRepositorio;

    // Obtener todas las subcategorías
    @GetMapping
    public ResponseEntity<List<Subcategoria>> obtenerTodasLasSubcategorias() {
        try {
            List<Subcategoria> subcategorias = subcategoriaRepositorio.findAll();
            return new ResponseEntity<>(subcategorias, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error al obtener subcategorías: " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Obtener subcategoría por ID
    @GetMapping("/{id}")
    public ResponseEntity<Subcategoria> obtenerSubcategoriaPorId(@PathVariable("id") int id) {
        try {
            Optional<Subcategoria> subcategoriaData = subcategoriaRepositorio.findById(id);
            return subcategoriaData
                    .map(subcategoria -> new ResponseEntity<>(subcategoria, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            System.err.println("Error al obtener subcategoría por ID: " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Crear nueva subcategoría
    @PostMapping
    public ResponseEntity<Subcategoria> crearSubcategoria(@RequestBody Subcategoria subcategoria) {
        try {
            if (subcategoria.getNombre() == null || subcategoria.getNombre().trim().isEmpty()) {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }

            if (subcategoria.getId_categoria() <= 0) {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }

            Subcategoria nuevaSubcategoria = new Subcategoria();
            nuevaSubcategoria.setNombre(subcategoria.getNombre().trim());
            nuevaSubcategoria.setId_categoria(subcategoria.getId_categoria());

            Subcategoria resultado = subcategoriaRepositorio.save(nuevaSubcategoria);
            return new ResponseEntity<>(resultado, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error al crear subcategoría: " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Actualizar subcategoría
    @PutMapping("/{id}")
    public ResponseEntity<Subcategoria> actualizarSubcategoria(@PathVariable("id") int id, @RequestBody Subcategoria subcategoria) {
        try {
            Optional<Subcategoria> subcategoriaData = subcategoriaRepositorio.findById(id);

            if (subcategoriaData.isPresent()) {
                Subcategoria subcategoriaExistente = subcategoriaData.get();

                if (subcategoria.getNombre() != null && !subcategoria.getNombre().trim().isEmpty()) {
                    subcategoriaExistente.setNombre(subcategoria.getNombre().trim());
                }

                if (subcategoria.getId_categoria() > 0) {
                    subcategoriaExistente.setId_categoria(subcategoria.getId_categoria());
                }

                Subcategoria actualizada = subcategoriaRepositorio.save(subcategoriaExistente);
                return new ResponseEntity<>(actualizada, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            System.err.println("Error al actualizar subcategoría: " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Eliminar subcategoría
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> eliminarSubcategoria(@PathVariable("id") int id) {
        try {
            if (subcategoriaRepositorio.existsById(id)) {
                subcategoriaRepositorio.deleteById(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            System.err.println("Error al eliminar subcategoría: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
