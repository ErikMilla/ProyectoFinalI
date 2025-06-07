// services/dashboardService.js
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8080/api';

class DashboardService {
  // Obtener métricas principales
  async getDashboardStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      if (!response.ok) {
        throw new Error('Error al obtener las estadísticas del dashboard');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getDashboardStats:', error);
      throw error;
    }
  }

  // Obtener datos de ventas mensuales
  async getMonthlySales() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/sales-monthly`);
      if (!response.ok) {
        throw new Error('Error al obtener las ventas mensuales');
      }
      const data = await response.json();
      
      // Formatear datos para Recharts
      return data.map(item => ({
        name: this.formatMonthName(item.nombre_mes),
        ventas: item.ventas || 0
      }));
    } catch (error) {
      console.error('Error en getMonthlySales:', error);
      throw error;
    }
  }

  // Obtener ventas por categoría
  async getSalesByCategory() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/sales-by-category`);
      if (!response.ok) {
        throw new Error('Error al obtener las ventas por categoría');
      }
      const data = await response.json();
      
      // Formatear datos para Recharts
      return data.map(item => ({
        name: item.name,
        value: parseFloat(item.value) || 0
      }));
    } catch (error) {
      console.error('Error en getSalesByCategory:', error);
      throw error;
    }
  }

  // Obtener pedidos recientes
  async getRecentOrders(limit = 5) {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/recent-orders?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Error al obtener los pedidos recientes');
      }
      const data = await response.json();
      
      // Formatear datos para la tabla
      return data.map(order => ({
        id: `#ORD-${String(order.id).padStart(3, '0')}`,
        cliente: order.cliente,
        fecha: order.fecha,
        total: order.total,
        estado: this.formatOrderStatus(order.estado)
      }));
    } catch (error) {
      console.error('Error en getRecentOrders:', error);
      throw error;
    }
  }

  // Obtener productos con bajo stock
  async getLowStockProducts(threshold = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/low-stock-products?threshold=${threshold}`);
      if (!response.ok) {
        throw new Error('Error al obtener productos con bajo stock');
      }
      const data = await response.json();
      
      // Formatear datos para la tabla
      return data.map(product => ({
        id: `PRD-${String(product.id).padStart(3, '0')}`,
        nombre: product.nombre,
        stock: product.stock,
        categoria: product.categoria
      }));
    } catch (error) {
      console.error('Error en getLowStockProducts:', error);
      throw error;
    }
  }

  // Obtener productos más vendidos
  async getTopSellingProducts(limit = 5) {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/top-selling-products?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Error al obtener productos más vendidos');
      }
      const data = await response.json();
      
      // Formatear datos para la tabla
      return data.map(product => ({
        id: `PRD-${String(product.id).padStart(3, '0')}`,
        nombre: product.nombre,
        ventas: product.ventas,
        ingresos: product.ingresos
      }));
    } catch (error) {
      console.error('Error en getTopSellingProducts:', error);
      throw error;
    }
  }

  // Funciones auxiliares
  formatMonthName(monthName) {
    const months = {
      'January': 'Ene', 'February': 'Feb', 'March': 'Mar',
      'April': 'Abr', 'May': 'May', 'June': 'Jun',
      'July': 'Jul', 'August': 'Ago', 'September': 'Sep',
      'October': 'Oct', 'November': 'Nov', 'December': 'Dic'
    };
    return months[monthName] || monthName?.substring(0, 3) || '';
  }

  formatOrderStatus(status) {
    const statusMap = {
      'proceso': 'En proceso',
      'completado': 'Completado',
      'pendiente': 'Pendiente',
      'cancelado': 'Cancelado'
    };
    return statusMap[status?.toLowerCase()] || status;
  }

  // Formatear números para mostrar
  formatCurrency(amount) {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  }

  formatNumber(number) {
    return new Intl.NumberFormat('es-PE').format(number);
  }

  formatPercentage(percentage) {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  }
}

export default new DashboardService();