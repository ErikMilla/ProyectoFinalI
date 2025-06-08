package com.ProyectoFinal.ProyectoFinalIntegrador.Controlador;

import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.Categoria;
import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.Marca;
import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.Producto;
import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.Subcategoria;
import com.ProyectoFinal.ProyectoFinalIntegrador.Respositorios.CategoriaRespositorio;
import com.ProyectoFinal.ProyectoFinalIntegrador.Respositorios.MarcaRespositorio;
import com.ProyectoFinal.ProyectoFinalIntegrador.Respositorios.ProductoRespositorio;
import com.ProyectoFinal.ProyectoFinalIntegrador.Respositorios.SubcategoriaRespositorio;
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
@CrossOrigin(origins = "http://localhost:3000") // ✅ AGREGADO CORS
public class CatalogoApiController {

    @Autowired
    private CategoriaRespositorio categoriaRespositorio;

    @Autowired
    private MarcaRespositorio marcaRespositorio;

    @Autowired
    private ProductoRespositorio productoRespositorio;

    @Autowired
    private SubcategoriaRespositorio subcategoriaRespositorio; // ✅ NUEVO

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

    // ✅ NUEVO ENDPOINT PARA OBTENER SUBCATEGORÍAS POR CATEGORÍA
    @GetMapping("/subcategorias")
    public List<Subcategoria> getSubcategorias() {
        return subcategoriaRespositorio.findAll();
    }

    // ✅ NUEVO ENDPOINT PARA OBTENER SUBCATEGORÍAS DE UNA CATEGORÍA ESPECÍFICA
    @GetMapping("/subcategorias/categoria/{idCategoria}")
    public List<Subcategoria> getSubcategoriasByCategoria(@PathVariable int idCategoria) {
        return subcategoriaRespositorio.findByIdCategoria(idCategoria);
    }

    @PostMapping("/productos")
    public ResponseEntity<Producto> createProducto(
            @RequestParam("file") MultipartFile file,
            @RequestParam("nombre") String nombre,
            @RequestParam("precio") BigDecimal precio,
            @RequestParam("stock") int stock,
            @RequestParam("idCategoria") int idCategoria,
            @RequestParam("idSubcategoria") int idSubcategoria, // ✅ NUEVO PARÁMETRO
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
            nuevoProducto.setIdSubcategoria(idSubcategoria); // ✅ NUEVO CAMPO
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
        return productoRespositorio.findProductosByIdCategoria(idCategoria);
    }

    // ✅ NUEVO ENDPOINT PARA OBTENER PRODUCTOS POR SUBCATEGORÍA
    @GetMapping("/productos/subcategoria/{idSubcategoria}")
    public List<Producto> getProductosBySubcategoria(@PathVariable int idSubcategoria) {
        return productoRespositorio.findByIdSubcategoria(idSubcategoria);
    }
}