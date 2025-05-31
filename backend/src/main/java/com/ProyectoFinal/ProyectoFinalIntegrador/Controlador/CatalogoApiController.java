package com.ProyectoFinal.ProyectoFinalIntegrador.Controlador;

import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.Categoria;
import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.Marca;
import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.Producto;
import com.ProyectoFinal.ProyectoFinalIntegrador.Respositorios.CategoriaRespositorio;
import com.ProyectoFinal.ProyectoFinalIntegrador.Respositorios.MarcaRespositorio;
import com.ProyectoFinal.ProyectoFinalIntegrador.Respositorios.ProductoRespositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/catalogo")
public class CatalogoApiController {

    @Autowired
    private CategoriaRespositorio categoriaRespositorio;

    @Autowired
    private MarcaRespositorio marcaRespositorio;

    @Autowired
    private ProductoRespositorio productoRespositorio;

    // Define el directorio donde se guardarán las imágenes (ajústalo según tu necesidad)
    private static final String UPLOAD_DIR = "./uploads/";

    @GetMapping("/categorias")
    public List<Categoria> getCategorias() {
        return categoriaRespositorio.findAll();
    }

    @GetMapping("/marcas")
    public List<Marca> getMarcas() {
        return marcaRespositorio.findAll();
    }

    @PostMapping("/productos")
    public ResponseEntity<Producto> createProducto(
            @RequestParam("file") MultipartFile file,
            @RequestParam("nombre") String nombre,
            @RequestParam("precio") BigDecimal precio,
            @RequestParam("stock") int stock,
            @RequestParam("idCategoria") int idCategoria,
            @RequestParam("idMarca") int idMarca) {

        try {
            // Guarda el archivo de imagen
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            // Crea el objeto Producto y guárdalo en la base de datos
            Producto nuevoProducto = new Producto();
            nuevoProducto.setNombre(nombre);
            nuevoProducto.setPrecio(precio);
            nuevoProducto.setStock(stock);
            nuevoProducto.setIdCategoria(idCategoria);
            nuevoProducto.setIdMarca(idMarca);
            nuevoProducto.setImagenUrl("/uploads/" + fileName); // Guarda la URL relativa

            Producto productoGuardado = productoRespositorio.save(nuevoProducto);
            return ResponseEntity.ok(productoGuardado);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/productos")
    public ResponseEntity<List<Producto>> listarProductos() {
        List<Producto> productos = productoRespositorio.findAll();
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/productos/categoria/{idCategoria}")
    public List<Producto> getProductosByCategoria(@PathVariable int idCategoria) {
        return productoRespositorio.findByIdCategoria(idCategoria);
    }
} 