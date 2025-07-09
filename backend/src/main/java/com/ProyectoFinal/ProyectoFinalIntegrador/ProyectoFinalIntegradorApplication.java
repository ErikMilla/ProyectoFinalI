package com.ProyectoFinal.ProyectoFinalIntegrador;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
// import org.springframework.context.annotation.ComponentScan; // Removed ComponentScan

@SpringBootApplication
@EnableScheduling  
public class ProyectoFinalIntegradorApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProyectoFinalIntegradorApplication.class, args);
        
        // Mensaje de confirmación
        System.out.println("🚀 Aplicación iniciada con tareas programadas habilitadas");
        System.out.println("⏰ Mantenimiento diario programado para las 2:00 AM");
    }
}