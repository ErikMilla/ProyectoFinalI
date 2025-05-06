package com.ProyectoFinal.ProyectoFinalIntegrador.Seguridad;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class Seguridadaconf {
@Autowired
private CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;
@Bean
public DefaultSecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
    return http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/").permitAll()
                .requestMatchers("/catalogo").permitAll()
                .requestMatchers("/nosotros").permitAll()
                .requestMatchers("/login").permitAll()
                .requestMatchers("/registrar").permitAll()
                .requestMatchers("/logout").permitAll()
                .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()
                .requestMatchers("/admin/**").hasRole("admin")
                .requestMatchers("/cliente/**").hasRole("cliente")
                .requestMatchers("/intranet").authenticated()
                .anyRequest().permitAll()
            )
                .formLogin(form-> form
                           .loginPage("/login")
                           .usernameParameter("email")
                           .passwordParameter("contraseña")
                           .successHandler(customAuthenticationSuccessHandler)
            )
                .logout(config -> config.logoutSuccessUrl("/"))
                .build();
            
} 
@Bean
public PasswordEncoder passwordEncoder(){
    return new BCryptPasswordEncoder();
}
}
