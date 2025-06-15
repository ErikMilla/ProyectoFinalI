package com.ProyectoFinal.ProyectoFinalIntegrador.Controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.*;
import java.math.BigDecimal;

// Importaciones de Google Guava
import com.google.common.collect.Maps;
import com.google.common.collect.Lists;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableList;
import com.google.common.base.Strings;
import com.google.common.math.DoubleMath;
import com.google.common.base.Preconditions;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.Cache;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Cache para mejorar performance en consultas frecuentes
    private final Cache<String, Object> cache = CacheBuilder.newBuilder()
            .maximumSize(100)
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .build();

    @GetMapping("/metricas")
    public Map<String, Object> obtenerMetricas() {
        // Usar Maps.newHashMap() de Guava para crear el mapa
        Map<String, Object> metricas = Maps.newHashMap();

        // Validar que el JdbcTemplate no sea null usando Preconditions
        Preconditions.checkNotNull(jdbcTemplate, "JdbcTemplate no puede ser null");

        String sqlIngresos = "SELECT COALESCE(SUM(dv.cantidad * p.precio), 0) as total " +
                "FROM detalle_venta dv " +
                "INNER JOIN productos p ON dv.id_producto = p.id_producto " +
                "INNER JOIN ventas v ON dv.id_venta = v.id_venta " +
                "WHERE MONTH(v.fecha_venta) = MONTH(CURRENT_DATE()) " +
                "AND YEAR(v.fecha_venta) = YEAR(CURRENT_DATE())";

        BigDecimal ingresosTotales = jdbcTemplate.queryForObject(sqlIngresos, BigDecimal.class);

        String sqlIngresosMesAnterior = "SELECT COALESCE(SUM(dv.cantidad * p.precio), 0) as total " +
                "FROM detalle_venta dv " +
                "INNER JOIN productos p ON dv.id_producto = p.id_producto " +
                "INNER JOIN ventas v ON dv.id_venta = v.id_venta " +
                "WHERE MONTH(v.fecha_venta) = MONTH(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)) " +
                "AND YEAR(v.fecha_venta) = YEAR(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))";

        BigDecimal ingresosMesAnterior = jdbcTemplate.queryForObject(sqlIngresosMesAnterior, BigDecimal.class);

        // Usar DoubleMath de Guava para cálculos más seguros
        double porcentajeCambioIngresos = 0;
        if (ingresosMesAnterior.compareTo(BigDecimal.ZERO) > 0) {
            double cambio = ((ingresosTotales.subtract(ingresosMesAnterior))
                    .divide(ingresosMesAnterior, 2, BigDecimal.ROUND_HALF_UP)
                    .multiply(new BigDecimal(100))).doubleValue();
            
            // Validar que el resultado sea finito usando DoubleMath
            porcentajeCambioIngresos = DoubleMath.fuzzyEquals(cambio, Double.NaN, 0.001) ? 0 : cambio;
        }

        String sqlPedidos = "SELECT COUNT(*) FROM ventas " +
                "WHERE MONTH(fecha_venta) = MONTH(CURRENT_DATE()) " +
                "AND YEAR(fecha_venta) = YEAR(CURRENT_DATE())";

        Integer pedidosCompletados = jdbcTemplate.queryForObject(sqlPedidos, Integer.class);

        String sqlClientes = "SELECT COUNT(*) FROM usuarios " +
                "WHERE rol = 'cliente' " +
                "AND MONTH(fechacreacion) = MONTH(CURRENT_DATE()) " +
                "AND YEAR(fechacreacion) = YEAR(CURRENT_DATE())";

        Integer nuevosClientes = jdbcTemplate.queryForObject(sqlClientes, Integer.class);

        String sqlProductos = "SELECT COALESCE(SUM(dv.cantidad), 0) FROM detalle_venta dv " +
                "INNER JOIN ventas v ON dv.id_venta = v.id_venta " +
                "WHERE MONTH(v.fecha_venta) = MONTH(CURRENT_DATE()) " +
                "AND YEAR(v.fecha_venta) = YEAR(CURRENT_DATE())";

        Integer productosVendidos = jdbcTemplate.queryForObject(sqlProductos, Integer.class);

        // Usar ImmutableMap.Builder para crear el resultado de forma más segura
        return ImmutableMap.<String, Object>builder()
                .put("ingresosTotales", ingresosTotales != null ? ingresosTotales : BigDecimal.ZERO)
                .put("cambioIngresos", porcentajeCambioIngresos)
                .put("pedidosCompletados", pedidosCompletados != null ? pedidosCompletados : 0)
                .put("nuevosClientes", nuevosClientes != null ? nuevosClientes : 0)
                .put("productosVendidos", productosVendidos != null ? productosVendidos : 0)
                .build();
    }

    @GetMapping("/ventas-por-mes")
    public List<Map<String, Object>> obtenerVentasPorMes() {
        String cacheKey = "ventas-por-mes";
        
        // Intentar obtener del cache primero
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> cachedResult = (List<Map<String, Object>>) cache.getIfPresent(cacheKey);
        if (cachedResult != null) {
            return cachedResult;
        }

        String sql = "SELECT DATE_FORMAT(v.fecha_venta, '%b') as mes, " +
                "COALESCE(SUM(dv.cantidad * p.precio), 0) as ventas " +
                "FROM ventas v " +
                "LEFT JOIN detalle_venta dv ON v.id_venta = dv.id_venta " +
                "LEFT JOIN productos p ON dv.id_producto = p.id_producto " +
                "WHERE v.fecha_venta >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 MONTH) " +
                "GROUP BY YEAR(v.fecha_venta), MONTH(v.fecha_venta), DATE_FORMAT(v.fecha_venta, '%b') " +
                "ORDER BY YEAR(v.fecha_venta), MONTH(v.fecha_venta)";

        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
        
        // Crear una lista inmutable y guardar en cache
        List<Map<String, Object>> immutableResult = ImmutableList.copyOf(result);
        cache.put(cacheKey, immutableResult);
        
        return immutableResult;
    }

    @GetMapping("/ventas-por-categoria")
    public List<Map<String, Object>> obtenerVentasPorCategoria() {
        String sql = "SELECT c.nombre as name, " +
                "COALESCE(SUM(dv.cantidad * p.precio), 0) as value " +
                "FROM categorias c " +
                "LEFT JOIN productos p ON c.id_categoria = p.id_categoria " +
                "LEFT JOIN detalle_venta dv ON p.id_producto = dv.id_producto " +
                "LEFT JOIN ventas v ON dv.id_venta = v.id_venta " +
                "WHERE (v.fecha_venta >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH) OR v.fecha_venta IS NULL) " +
                "GROUP BY c.id_categoria, c.nombre";

        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
        
        // Filtrar resultados usando Guava, eliminando entradas con nombres null o vacíos
        List<Map<String, Object>> filteredResult = Lists.newArrayList();
        for (Map<String, Object> row : result) {
            String name = (String) row.get("name");
            if (!Strings.isNullOrEmpty(name)) {
                filteredResult.add(row);
            }
        }
        
        return ImmutableList.copyOf(filteredResult);
    }

    @GetMapping("/cantidad-por-mes")
    public List<Map<String, Object>> obtenerCantidadPorMes() {
        String sql = "SELECT DATE_FORMAT(v.fecha_venta, '%b') as mes, " +
                "COALESCE(SUM(dv.cantidad), 0) as cantidad " +
                "FROM ventas v " +
                "LEFT JOIN detalle_venta dv ON v.id_venta = dv.id_venta " +
                "WHERE v.fecha_venta >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 MONTH) " +
                "GROUP BY YEAR(v.fecha_venta), MONTH(v.fecha_venta), DATE_FORMAT(v.fecha_venta, '%b') " +
                "ORDER BY YEAR(v.fecha_venta), MONTH(v.fecha_venta)";

        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
        return ImmutableList.copyOf(result);
    }

    @GetMapping("/cantidad-por-categoria")
    public List<Map<String, Object>> obtenerCantidadPorCategoria() {
        String sql = "SELECT c.nombre as name, " +
                "COALESCE(SUM(dv.cantidad), 0) as value " +
                "FROM categorias c " +
                "LEFT JOIN productos p ON c.id_categoria = p.id_categoria " +
                "LEFT JOIN detalle_venta dv ON p.id_producto = dv.id_producto " +
                "LEFT JOIN ventas v ON dv.id_venta = v.id_venta " +
                "WHERE (v.fecha_venta >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH) OR v.fecha_venta IS NULL) " +
                "GROUP BY c.id_categoria, c.nombre";

        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
        
        // Filtrar y transformar usando Guava
        List<Map<String, Object>> processedResult = Lists.newArrayList();
        for (Map<String, Object> row : result) {
            String name = (String) row.get("name");
            if (!Strings.isNullOrEmpty(name)) {
                // Crear un mapa inmutable para cada fila
                Map<String, Object> immutableRow = ImmutableMap.of(
                    "name", name,
                    "value", row.get("value") != null ? row.get("value") : 0
                );
                processedResult.add(immutableRow);
            }
        }
        
        return ImmutableList.copyOf(processedResult);
    }

    @GetMapping("/resumen-categorias")
    public List<Map<String, Object>> obtenerResumenCategorias() {
        String sql = "SELECT c.nombre as categoria, " +
                "COUNT(DISTINCT p.id_producto) as productos_totales, " +
                "COALESCE(SUM(dv.cantidad), 0) as cantidad_vendida, " +
                "COALESCE(SUM(dv.cantidad * p.precio), 0) as ingresos_totales, " +
                "COALESCE(AVG(p.precio), 0) as precio_promedio, " +
                "COALESCE(COUNT(DISTINCT v.id_venta), 0) as numero_ventas " +
                "FROM categorias c " +
                "LEFT JOIN productos p ON c.id_categoria = p.id_categoria " +
                "LEFT JOIN detalle_venta dv ON p.id_producto = dv.id_producto " +
                "LEFT JOIN ventas v ON dv.id_venta = v.id_venta " +
                "WHERE (v.fecha_venta >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH) OR v.fecha_venta IS NULL) " +
                "GROUP BY c.id_categoria, c.nombre " +
                "ORDER BY ingresos_totales DESC";

        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
        
        // Procesar y validar datos usando Guava
        List<Map<String, Object>> processedResult = Lists.newArrayList();
        for (Map<String, Object> row : result) {
            String categoria = (String) row.get("categoria");
            if (!Strings.isNullOrEmpty(categoria)) {
                processedResult.add(row);
            }
        }
        
        return ImmutableList.copyOf(processedResult);
    }

    @GetMapping("/estadisticas")
    public Map<String, Object> obtenerEstadisticas() {
        String cacheKey = "estadisticas-generales";
        
        // Intentar obtener del cache
        @SuppressWarnings("unchecked")
        Map<String, Object> cachedStats = (Map<String, Object>) cache.getIfPresent(cacheKey);
        if (cachedStats != null) {
            return cachedStats;
        }

        String sqlTotalProductos = "SELECT COUNT(*) FROM productos";
        Integer totalProductos = jdbcTemplate.queryForObject(sqlTotalProductos, Integer.class);

        String sqlStockBajo = "SELECT COUNT(*) FROM productos WHERE stock < 10";
        Integer productosStockBajo = jdbcTemplate.queryForObject(sqlStockBajo, Integer.class);

        String sqlClienteFrecuente = "SELECT u.nombre, COUNT(v.id_venta) as compras " +
                "FROM usuarios u " +
                "INNER JOIN ventas v ON u.id = v.id_usuario " +
                "WHERE u.rol = 'cliente' " +
                "GROUP BY u.id, u.nombre " +
                "ORDER BY compras DESC " +
                "LIMIT 1";

        List<Map<String, Object>> clienteFrecuente = jdbcTemplate.queryForList(sqlClienteFrecuente);

        // Crear estadísticas usando ImmutableMap para mayor seguridad
        Map<String, Object> stats = ImmutableMap.<String, Object>builder()
                .put("totalProductos", totalProductos != null ? totalProductos : 0)
                .put("productosStockBajo", productosStockBajo != null ? productosStockBajo : 0)
                .put("clienteFrecuente", clienteFrecuente.isEmpty() ? null : clienteFrecuente.get(0))
                .build();

        // Guardar en cache
        cache.put(cacheKey, stats);
        
        return stats;
    }

    // Método adicional para limpiar el cache manualmente si es necesario
    @PostMapping("/limpiar-cache")
    public Map<String, String> limpiarCache() {
        cache.invalidateAll();
        return ImmutableMap.of("mensaje", "Cache limpiado exitosamente");
    }

    // Método para obtener estadísticas del cache
    @GetMapping("/cache-stats")
    public Map<String, Object> obtenerEstadisticasCache() {
        return ImmutableMap.<String, Object>builder()
                .put("size", cache.size())
                .put("hitCount", cache.stats().hitCount())
                .put("missCount", cache.stats().missCount())
                .put("hitRate", cache.stats().hitRate())
                .build();
    }
}