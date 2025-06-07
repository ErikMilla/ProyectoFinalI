package com.ProyectoFinal.ProyectoFinalIntegrador.Controlador;

import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.AppUser;
import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.RegistroDto;
import com.ProyectoFinal.ProyectoFinalIntegrador.Respositorios.AppUserRespositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminControlador {

    @Autowired
    private AppUserRespositorio repo;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarAdmin(@RequestBody RegistroDto registroDto) {
        System.out.println("Intentando registrar administrador...");
        Map<String, Object> response = new HashMap<>();

        // Validación de contraseñas
        if (!registroDto.getContraseña().equals(registroDto.getConfirmarcontraseña())) {
            response.put("success", false);
            response.put("message", "Las contraseñas no coinciden");
            return ResponseEntity.badRequest().body(response);
        }

        // Validación de email existente
        AppUser appUser = repo.findByEmail(registroDto.getEmail());
        if (appUser != null) {
            response.put("success", false);
            response.put("message", "Esta dirección de correo ya está en uso");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            var bCryptEncoder = new BCryptPasswordEncoder();
            AppUser newUser = new AppUser();
            newUser.setNombre(registroDto.getNombre());
            newUser.setApellidos(registroDto.getApellidos());
            newUser.setEmail(registroDto.getEmail());
            newUser.setTelefono(registroDto.getTelefono());
            newUser.setDireccion(registroDto.getDireccion());
            newUser.setRol("admin"); // Rol específico para administradores
            newUser.setFechacreacion(new Date());
            newUser.setContraseña(bCryptEncoder.encode(registroDto.getContraseña()));
            repo.save(newUser);

            response.put("success", true);
            response.put("message", "Administrador registrado correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            response.put("success", false);
            response.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<AppUser>> obtenerTodosLosUsuarios() {
        try {
            List<AppUser> usuarios = repo.findAll();
            return ResponseEntity.ok(usuarios);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<AppUser> obtenerUsuarioPorId(@PathVariable int id) {
        try {
            AppUser usuario = repo.findById(id).orElse(null);
            if (usuario != null) {
                return ResponseEntity.ok(usuario);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }
}