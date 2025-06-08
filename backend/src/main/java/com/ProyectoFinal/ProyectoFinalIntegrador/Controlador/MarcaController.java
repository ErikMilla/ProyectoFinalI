package com.ProyectoFinal.ProyectoFinalIntegrador.Controlador;

import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.Marca;
import com.ProyectoFinal.ProyectoFinalIntegrador.Respositorios.MarcaRespositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/marcas")
@CrossOrigin(origins = "http://localhost:3000")
public class MarcaController {

    @Autowired
    private MarcaRespositorio marcaRepositorio;

    // Obtener todas las marcas
    @GetMapping
    public ResponseEntity<List<Marca>> obtenerTodasLasMarcas() {
        try {
            List<Marca> marcas = marcaRepositorio.findAll();
            return new ResponseEntity<>(marcas, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Obtener marca por ID
    @GetMapping("/{id}")
    public ResponseEntity<Marca> obtenerMarcaPorId(@PathVariable("id") int id) {
        Optional<Marca> marcaData = marcaRepositorio.findById(id);

        if (marcaData.isPresent()) {
            return new ResponseEntity<>(marcaData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Crear nueva marca
    @PostMapping
    public ResponseEntity<Marca> crearMarca(@RequestBody Marca marca) {
        try {
            Marca nuevaMarca = new Marca();
            nuevaMarca.setNombre(marca.getNombre());
            return new ResponseEntity<>(marcaRepositorio.save(nuevaMarca), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Actualizar marca
    @PutMapping("/{id}")
    public ResponseEntity<Marca> actualizarMarca(@PathVariable("id") int id, @RequestBody Marca marca) {
        Optional<Marca> marcaData = marcaRepositorio.findById(id);

        if (marcaData.isPresent()) {
            Marca marcaActualizada = marcaData.get();
            marcaActualizada.setNombre(marca.getNombre());
            return new ResponseEntity<>(marcaRepositorio.save(marcaActualizada), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar marca
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> eliminarMarca(@PathVariable("id") int id) {
        try {
            marcaRepositorio.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}