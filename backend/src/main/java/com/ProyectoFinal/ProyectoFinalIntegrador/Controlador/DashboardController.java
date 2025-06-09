package com.ProyectoFinal.ProyectoFinalIntegrador.Controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/metricas")
    public Map<String, Object> obtenerMetricas() {
        Map<String, Object> metricas = new HashMap<>();

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

        double porcentajeCambioIngresos = 0;
        if (ingresosMesAnterior.compareTo(BigDecimal.ZERO) > 0) {
            porcentajeCambioIngresos = ((ingresosTotales.subtract(ingresosMesAnterior))
                    .divide(ingresosMesAnterior, 2, BigDecimal.ROUND_HALF_UP)
                    .multiply(new BigDecimal(100))).doubleValue();
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

        metricas.put("ingresosTotales", ingresosTotales);
        metricas.put("cambioIngresos", porcentajeCambioIngresos);
        metricas.put("pedidosCompletados", pedidosCompletados);
        metricas.put("nuevosClientes", nuevosClientes);
        metricas.put("productosVendidos", productosVendidos);

        return metricas;
    }

    @GetMapping("/ventas-por-mes")
    public List<Map<String, Object>> obtenerVentasPorMes() {
        String sql = "SELECT DATE_FORMAT(v.fecha_venta, '%b') as mes, " +
                "COALESCE(SUM(dv.cantidad * p.precio), 0) as ventas " +
                "FROM ventas v " +
                "LEFT JOIN detalle_venta dv ON v.id_venta = dv.id_venta " +
                "LEFT JOIN productos p ON dv.id_producto = p.id_producto " +
                "WHERE v.fecha_venta >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 MONTH) " +
                "GROUP BY YEAR(v.fecha_venta), MONTH(v.fecha_venta), DATE_FORMAT(v.fecha_venta, '%b') " +
                "ORDER BY YEAR(v.fecha_venta), MONTH(v.fecha_venta)";

        return jdbcTemplate.queryForList(sql);
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

        return jdbcTemplate.queryForList(sql);
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

        return jdbcTemplate.queryForList(sql);
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

        return jdbcTemplate.queryForList(sql);
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

        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/estadisticas")
    public Map<String, Object> obtenerEstadisticas() {
        Map<String, Object> stats = new HashMap<>();

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

        stats.put("totalProductos", totalProductos);
        stats.put("productosStockBajo", productosStockBajo);
        stats.put("clienteFrecuente", clienteFrecuente.isEmpty() ? null : clienteFrecuente.get(0));

        return stats;
    }
}
