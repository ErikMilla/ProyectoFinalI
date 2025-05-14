
package com.ProyectoFinal.ProyectoFinalIntegrador.Servicio;

import com.ProyectoFinal.ProyectoFinalIntegrador.Modelos.AppUser;
import com.ProyectoFinal.ProyectoFinalIntegrador.Respositorios.AppUserRespositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AppUserServicio implements UserDetailsService{
    @Autowired
    private AppUserRespositorio repo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AppUser appUser = repo.findByEmail(email);
        if(appUser !=null){
           var springUser = User.withUsername(appUser.getEmail())
                   .password(appUser.getContraseña())
                   .roles(appUser.getRol())
                   .build();
           return springUser;
        }
        return null;
    }
}
