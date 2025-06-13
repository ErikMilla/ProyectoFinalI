package com.ProyectoFinal.ProyectoFinalIntegrador.Seguridad;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import com.google.common.util.concurrent.RateLimiter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.annotation.PostConstruct;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Configuración de seguridad específica para exportación Excel
 */
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class ExcelSecurityConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(ExcelSecurityConfig.class);
    
    @Value("${export.max-file-size:10485760}") // 10MB por defecto
    private long maxFileSize;
    
    @Value("${export.allowed-types:COMPLETO,VENTAS,INVENTARIO,CATEGORIAS}")
    private String allowedTypesStr;
    
    @Value("${export.rate-limit-per-hour:10}")
    private int rateLimitPerHour;
    
    @Value("${export.security.enable-encryption:false}")
    private boolean encryptionEnabled;
    
    @Value("${export.security.enable-watermark:true}")
    private boolean watermarkEnabled;
    
    @Value("${export.security.watermark-text:CONFIDENCIAL}")
    private String watermarkText;
    
    @Value("${export.audit.enabled:true}")
    private boolean auditEnabled;
    
    @Value("${export.cleanup.enabled:true}")
    private boolean cleanupEnabled;
    
    @Value("${export.cleanup.interval:6}")
    private int cleanupIntervalHours;
    
    private Set<String> allowedTypes;
    private final ConcurrentHashMap<String, RateLimiter> userRateLimiters = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> exportHistory = new ConcurrentHashMap<>();
    private ScheduledExecutorService cleanupExecutor;
    
    @PostConstruct
    public void init() {
        // Inicializar tipos permitidos
        this.allowedTypes = new HashSet<>(Arrays.asList(allowedTypesStr.split(",")));
        logger.info("Tipos de exportación permitidos: {}", allowedTypes);
        
        // Inicializar servicio de limpieza
        if (cleanupEnabled) {
            cleanupExecutor = Executors.newSingleThreadScheduledExecutor();
            cleanupExecutor.scheduleAtFixedRate(
                this::cleanupOldRecords, 
                cleanupIntervalHours, 
                cleanupIntervalHours, 
                TimeUnit.HOURS
            );
            logger.info("Servicio de limpieza programado cada {} horas", cleanupIntervalHours);
        }
        
        logger.info("Configuración de exportación Excel inicializada");
        logger.info("- Tamaño máximo de archivo: {} MB", maxFileSize / (1024 * 1024));
        logger.info("- Límite de exportaciones por hora: {}", rateLimitPerHour);
        logger.info("- Encriptación habilitada: {}", encryptionEnabled);
        logger.info("- Marca de agua habilitada: {}", watermarkEnabled);
        logger.info("- Auditoría habilitada: {}", auditEnabled);
    }
    
    /**
     * Valida si un tipo de reporte está permitido
     */
    public boolean isAllowedReportType(String reportType) {
        return reportType != null && allowedTypes.contains(reportType.toUpperCase());
    }
    
    /**
     * Verifica el rate limit para un usuario
     */
    public boolean checkRateLimit(String userId) {
        RateLimiter limiter = userRateLimiters.computeIfAbsent(
            userId, 
            k -> RateLimiter.create(rateLimitPerHour / 60.0) // Convertir a permits por minuto
        );
        
        boolean allowed = limiter.tryAcquire();
        if (!allowed) {
            logger.warn("Usuario {} excedió el límite de exportaciones", userId);
        }
        return allowed;
    }
    
    /**
     * Registra una exportación en el historial
     */
    public void recordExport(String userId, String reportType, long fileSize) {
        if (auditEnabled) {
            String key = userId + "_" + reportType + "_" + System.currentTimeMillis();
            exportHistory.put(key, fileSize);
            logger.info("Exportación registrada - Usuario: {}, Tipo: {}, Tamaño: {} bytes", 
                userId, reportType, fileSize);
        }
    }
    
    /**
     * Limpia registros antiguos
     */
    private void cleanupOldRecords() {
        try {
            long cutoffTime = System.currentTimeMillis() - TimeUnit.DAYS.toMillis(7); // 7 días
            int removed = 0;
            
            for (String key : exportHistory.keySet()) {
                String[] parts = key.split("_");
                if (parts.length >= 3) {
                    long timestamp = Long.parseLong(parts[parts.length - 1]);
                    if (timestamp < cutoffTime) {
                        exportHistory.remove(key);
                        removed++;
                    }
                }
            }
            
            if (removed > 0) {
                logger.info("Limpieza completada: {} registros antiguos eliminados", removed);
            }
        } catch (Exception e) {
            logger.error("Error durante la limpieza de registros", e);
        }
    }
    
    /**
     * Obtiene estadísticas de exportación
     */
    public ExportStats getExportStats(String userId) {
        long totalExports = exportHistory.keySet().stream()
            .filter(key -> key.startsWith(userId + "_"))
            .count();
            
        long totalSize = exportHistory.entrySet().stream()
            .filter(entry -> entry.getKey().startsWith(userId + "_"))
            .mapToLong(entry -> entry.getValue())
            .sum();
            
        return new ExportStats(totalExports, totalSize);
    }
    
    // Getters para usar en otros componentes
    public long getMaxFileSize() {
        return maxFileSize;
    }
    
    public boolean isEncryptionEnabled() {
        return encryptionEnabled;
    }
    
    public boolean isWatermarkEnabled() {
        return watermarkEnabled;
    }
    
    public String getWatermarkText() {
        return watermarkText;
    }
    
    public boolean isAuditEnabled() {
        return auditEnabled;
    }
    
    // Clase interna para estadísticas
    public static class ExportStats {
        private final long totalExports;
        private final long totalSize;
        
        public ExportStats(long totalExports, long totalSize) {
            this.totalExports = totalExports;
            this.totalSize = totalSize;
        }
        
        public long getTotalExports() {
            return totalExports;
        }
        
        public long getTotalSize() {
            return totalSize;
        }
        
        public double getTotalSizeMB() {
            return totalSize / (1024.0 * 1024.0);
        }
    }
    
    /**
     * Bean para el rate limiter de Guava
     */
    @Bean
    public RateLimiter globalRateLimiter() {
        return RateLimiter.create(100); // 100 requests por segundo global
    }
}