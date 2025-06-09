package com.ProyectoFinal.ProyectoFinalIntegrador.Controlador;

import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.Proveedor;
import com.ProyectoFinal.ProyectoFinalIntegrador.Respositorios.ProveedorRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(origins = "http://localhost:3000")
public class ProveedorController {

    @Autowired
    private ProveedorRepositorio proveedorRepositorio;

    // Obtener todos los proveedores
    @GetMapping
    public ResponseEntity<List<Proveedor>> obtenerTodosLosProveedores() {
        try {
            List<Proveedor> proveedores = proveedorRepositorio.findAll();
            return new ResponseEntity<>(proveedores, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Obtener proveedor por ID
    @GetMapping("/{id}")
    public ResponseEntity<Proveedor> obtenerProveedorPorId(@PathVariable("id") int id) {
        Optional<Proveedor> proveedorData = proveedorRepositorio.findById(id);

        if (proveedorData.isPresent()) {
            return new ResponseEntity<>(proveedorData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Crear nuevo proveedor
    @PostMapping
    public ResponseEntity<Proveedor> crearProveedor(@RequestBody Proveedor proveedor) {
        try {
            Proveedor nuevoProveedor = new Proveedor();
            nuevoProveedor.setNombre_proveedor(proveedor.getNombre_proveedor());
            nuevoProveedor.setNombre_empresa(proveedor.getNombre_empresa());
            nuevoProveedor.setTelefono(proveedor.getTelefono());
            nuevoProveedor.setRuc(proveedor.getRuc());
            return new ResponseEntity<>(proveedorRepositorio.save(nuevoProveedor), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Actualizar proveedor
    @PutMapping("/{id}")
    public ResponseEntity<Proveedor> actualizarProveedor(@PathVariable("id") int id, @RequestBody Proveedor proveedor) {
        Optional<Proveedor> proveedorData = proveedorRepositorio.findById(id);

        if (proveedorData.isPresent()) {
            Proveedor proveedorActualizado = proveedorData.get();
            proveedorActualizado.setNombre_proveedor(proveedor.getNombre_proveedor());
            proveedorActualizado.setNombre_empresa(proveedor.getNombre_empresa());
            proveedorActualizado.setTelefono(proveedor.getTelefono());
            proveedorActualizado.setRuc(proveedor.getRuc());
            return new ResponseEntity<>(proveedorRepositorio.save(proveedorActualizado), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar proveedor
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> eliminarProveedor(@PathVariable("id") int id) {
        try {
            proveedorRepositorio.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}