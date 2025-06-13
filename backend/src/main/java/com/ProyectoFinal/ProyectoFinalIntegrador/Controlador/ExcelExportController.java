package com.ProyectoFinal.ProyectoFinalIntegrador.Controlador;

import com.ProyectoFinal.ProyectoFinalIntegrador.Servicio.ExcelExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ExcelExportController {
    
    private static final Logger logger = LoggerFactory.getLogger(ExcelExportController.class);
    private static final int MAX_EXPORT_SIZE = 10 * 1024 * 1024; // 10MB máximo
    
    @Autowired
    private ExcelExportService excelExportService;
    
    @Value("${export.max-file-size}")
    private String maxFileSize;
    
    @Value("${export.allowed-types}")
    private String[] allowedTypes;
    
    @Value("${export.rate-limit-per-hour}")
    private int rateLimitPerHour;
    
    /**
     * Endpoint para obtener configuración del servicio (solo ADMIN)
     */
    @GetMapping("/config")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> obtenerConfiguracion() {
        Map<String, Object> config = new HashMap<>();
        
        // Verificar configuración cargada
        config.put("maxFileSize", maxFileSize);
        config.put("allowedTypes", allowedTypes);
        config.put("rateLimitPerHour", rateLimitPerHour);
        config.put("tempDirectory", System.getProperty("java.io.tmpdir"));
        config.put("javaVersion", System.getProperty("java.version"));
        config.put("poiVersion", XSSFWorkbook.class.getPackage().getImplementationVersion());
        
        return ResponseEntity.ok(config);
    }
    
    /**
     * Endpoint principal para exportar dashboard a Excel
     * Solo usuarios autenticados pueden exportar
     */
    @GetMapping("/dashboard/excel")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public ResponseEntity<byte[]> exportarDashboardExcel(
            @RequestParam(defaultValue = "COMPLETO") 
            @Pattern(regexp = "^(COMPLETO|VENTAS|INVENTARIO|CATEGORIAS)$", 
                     message = "Tipo de reporte inválido") String tipoReporte,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin,
            HttpServletRequest request) {
        
        try {
            // Log de auditoría
            logger.info("Usuario {} solicitó exportación tipo: {} desde IP: {}", 
                       request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : "Anónimo",
                       tipoReporte,
                       obtenerIPCliente(request));
            
            // Validar fechas
            if (fechaInicio == null) {
                fechaInicio = LocalDateTime.now().minusMonths(1);
            }
            if (fechaFin == null) {
                fechaFin = LocalDateTime.now();
            }
            
            // Generar Excel
            byte[] excelBytes = excelExportService.generarReporteDashboard(tipoReporte, fechaInicio, fechaFin);
            
            // Validar tamaño
            if (excelBytes.length > MAX_EXPORT_SIZE) {
                logger.warn("Archivo Excel excede el tamaño máximo permitido: {} bytes", excelBytes.length);
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                    .body("El archivo es demasiado grande. Por favor, reduzca el rango de fechas.".getBytes());
            }
            
            // Preparar headers seguros
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            
            String filename = excelExportService.generarNombreArchivoSeguro(tipoReporte);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setCacheControl("no-cache, no-store, must-revalidate");
            headers.setPragma("no-cache");
            headers.setExpires(0);
            
            // Agregar headers de seguridad
            headers.add("X-Content-Type-Options", "nosniff");
            headers.add("X-Frame-Options", "DENY");
            headers.add("X-XSS-Protection", "1; mode=block");
            
            logger.info("Exportación exitosa: {} bytes generados", excelBytes.length);
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelBytes);
                    
        } catch (IllegalArgumentException e) {
            logger.error("Error de validación en exportación: ", e);
            return ResponseEntity.badRequest()
                    .body(("Error de validación: " + e.getMessage()).getBytes());
        } catch (IOException e) {
            logger.error("Error al generar Excel: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al generar el archivo Excel".getBytes());
        } catch (Exception e) {
            logger.error("Error inesperado en exportación: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado al procesar la solicitud".getBytes());
        }
    }
    
    /**
     * Endpoint para exportar ventas específicas
     */
    @PostMapping("/ventas/excel")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public ResponseEntity<byte[]> exportarVentasExcel(
            @RequestBody @Valid ExportRequest exportRequest,
            HttpServletRequest request) {
        
        try {
            // Validar request
            if (exportRequest.getIds() != null && exportRequest.getIds().size() > 1000) {
                return ResponseEntity.badRequest()
                    .body("No se pueden exportar más de 1000 registros a la vez".getBytes());
            }
            
            // Log de auditoría
            logger.info("Exportación de ventas solicitada por: {} - Cantidad: {}", 
                       request.getUserPrincipal().getName(),
                       exportRequest.getIds() != null ? exportRequest.getIds().size() : "Todas");
            
            // Generar Excel con filtros específicos
            byte[] excelBytes = excelExportService.generarReporteVentasDetallado(
                exportRequest.getIds(),
                exportRequest.getFechaInicio(),
                exportRequest.getFechaFin(),
                exportRequest.getEstado()
            );
            
            HttpHeaders headers = crearHeadersSeguras("Ventas_Detalle");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelBytes);
                    
        } catch (Exception e) {
            logger.error("Error al exportar ventas: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al generar el archivo Excel".getBytes());
        }
    }
    
    /**
     * Endpoint para exportar inventario con alertas
     */
    @GetMapping("/inventario/excel")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public ResponseEntity<byte[]> exportarInventarioExcel(
            @RequestParam(defaultValue = "false") boolean soloStockBajo,
            @RequestParam(defaultValue = "30") int umbralStock,
            HttpServletRequest request) {
        
        try {
            // Validar umbral
            if (umbralStock < 0 || umbralStock > 1000) {
                return ResponseEntity.badRequest()
                    .body("Umbral de stock inválido".getBytes());
            }
            
            logger.info("Exportación de inventario - Stock bajo: {}, Umbral: {}", 
                       soloStockBajo, umbralStock);
            
            byte[] excelBytes = excelExportService.generarReporteInventario(soloStockBajo, umbralStock);
            
            HttpHeaders headers = crearHeadersSeguras("Inventario");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelBytes);
                    
        } catch (Exception e) {
            logger.error("Error al exportar inventario: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al generar el archivo Excel".getBytes());
        }
    }
    
    /**
     * Endpoint para verificar el estado del servicio de exportación
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> verificarEstadoExportacion() {
        Map<String, Object> status = new HashMap<>();
        status.put("servicio", "Exportación Excel");
        status.put("estado", "Activo");
        status.put("version", "1.0");
        status.put("formatos", new String[]{"Excel 2007+ (.xlsx)"});
        status.put("limiteArchivo", MAX_EXPORT_SIZE / (1024 * 1024) + " MB");
        
        return ResponseEntity.ok(status);
    }
    
    /**
     * Endpoint para descargar plantilla de importación
     */
    @GetMapping("/template/{tipo}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> descargarPlantilla(
            @PathVariable @Pattern(regexp = "^(productos|ventas|clientes)$") String tipo) {
        
        try {
            byte[] plantilla = excelExportService.generarPlantilla(tipo);
            
            HttpHeaders headers = crearHeadersSeguras("Plantilla_" + tipo);
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(plantilla);
                    
        } catch (Exception e) {
            logger.error("Error al generar plantilla: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al generar la plantilla".getBytes());
        }
    }
    
    /**
     * Métodos auxiliares
     */
    private HttpHeaders crearHeadersSeguras(String nombreBase) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        
        String filename = excelExportService.generarNombreArchivoSeguro(nombreBase);
        headers.setContentDispositionFormData("attachment", filename);
        
        // Headers de seguridad
        headers.setCacheControl("no-cache, no-store, must-revalidate");
        headers.setPragma("no-cache");
        headers.setExpires(0);
        headers.add("X-Content-Type-Options", "nosniff");
        headers.add("X-Frame-Options", "DENY");
        headers.add("X-XSS-Protection", "1; mode=block");
        headers.add("Content-Security-Policy", "default-src 'none'");
        
        return headers;
    }
    
    private String obtenerIPCliente(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
    
    /**
     * Clase para el request de exportación
     */
    public static class ExportRequest {
        @Size(max = 1000, message = "Máximo 1000 registros por exportación")
        private List<Integer> ids;
        
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        private LocalDateTime fechaInicio;
        
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        private LocalDateTime fechaFin;
        
        @Pattern(regexp = "^(proceso|completado|cancelado|pendiente)$")
        private String estado;
        
        // Getters y setters
        public List<Integer> getIds() { return ids; }
        public void setIds(List<Integer> ids) { this.ids = ids; }
        
        public LocalDateTime getFechaInicio() { return fechaInicio; }
        public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }
        
        public LocalDateTime getFechaFin() { return fechaFin; }
        public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }
        
        public String getEstado() { return estado; }
        public void setEstado(String estado) { this.estado = estado; }
    }
}