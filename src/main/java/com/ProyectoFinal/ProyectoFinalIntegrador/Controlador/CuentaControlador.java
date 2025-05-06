package com.ProyectoFinal.ProyectoFinalIntegrador.Controlador;

import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.AppUser;
import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.RegistroDto;
import com.ProyectoFinal.ProyectoFinalIntegrador.Respositorios.AppUserRespositorio;
import jakarta.validation.Valid;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class CuentaControlador {
    @Autowired
    private AppUserRespositorio repo;
    @GetMapping("/registrar")
    public String registrar(Model modelo){
        RegistroDto registroDto = new RegistroDto();
        modelo.addAttribute("registrarDto", registroDto);
        modelo.addAttribute("success", false);
        return "registrar";
    }
    
    @GetMapping("/perfil")
    public String Perfil(Authentication auth, Model modelo){
        AppUser user= repo.findByEmail(auth.getName());
        modelo.addAttribute("appUser", user);
        return "profile";
    }
    
    @PostMapping("/registrar")
    public String registrar(Model modelo, @Valid @ModelAttribute("registrarDto") RegistroDto registroDto, BindingResult result){
        if(!registroDto.getContraseña().equals(registroDto.getConfirmarcontraseña())){
            result.addError(new FieldError("registrarDto", "confirmarcontraseña", "Las contraseñas no coinciden"));
        }
        AppUser appUser = repo.findByEmail(registroDto.getEmail());
        if(appUser !=null){
            result.addError(new FieldError("registrarDto", "email","Esta direccion de correo ya esta en uso"));
        }
        if(result.hasErrors()){ 
            modelo.addAttribute("success", false);
            return "registrar"; 
        }
        try{
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
            modelo.addAttribute("registrarDto", new RegistroDto());
            modelo.addAttribute("success", true);
        }catch(Exception ex){
            result.addError(new FieldError("registrarDto", "nombre", ex.getMessage()));
            modelo.addAttribute("success", false);
        }
        return "registrar";
    }
}
