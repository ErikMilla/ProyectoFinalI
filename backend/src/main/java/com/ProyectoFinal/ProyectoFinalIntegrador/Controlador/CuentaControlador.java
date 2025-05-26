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
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class CuentaControlador {

    @Autowired
    private AppUserRespositorio repo;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody RegistroDto registroDto) {
        System.out.println("Intentando registrar usuario...");
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
            newUser.setRol("cliente");
            newUser.setFechacreacion(new Date());
            newUser.setContraseña(bCryptEncoder.encode(registroDto.getContraseña()));
            repo.save(newUser);

            response.put("success", true);
            response.put("message", "Usuario registrado correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            response.put("success", false);
            response.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}