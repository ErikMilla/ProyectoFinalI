import React, { useState, useEffect } from 'react';
import '../css/Productos.css';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

function Productos() {
  // ===============================
  // CONFIGURACIÓN
  // ===============================
  const BACKEND_PORT = 8081;

  // ===============================
  // ESTADO DEL COMPONENTE
  // ===============================
  
  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [subcategoriaId, setSubcategoriaId] = useState('');
  const [marcaId, setMarcaId] = useState('');
  const [imagen, setImagen] = useState(null);

  // Estados de datos
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [subcategoriasFiltradas, setSubcategoriasFiltradas] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [productos, setProductos] = useState([]);

  // Estados de UI
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [userRole, setUserRole] = useState(localStorage.getItem('rol'));

  // Navegación y Contexto del Carrito
  const navigate = useNavigate();
  const { fetchCarrito } = useCarrito();

  // ===============================
  // EFECTOS
  // ===============================
  
  // Efecto principal de inicialización
  useEffect(() => {
    obtenerDatosIniciales();
    fetchProductos();
    
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem('rol'));
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Efecto para filtrar subcategorías cuando cambia la categoría
  useEffect(() => {
    console.log('Filtrando subcategorías:', { categoriaId, subcategorias });

    if (categoriaId && Array.isArray(subcategorias) && subcategorias.length > 0) {
      let idParaFiltrar = parseInt(categoriaId);

      // **MODIFICACIÓN INICIA AQUI**
      // Intercambiar el criterio de filtrado para las categorías con IDs 1 y 2
      if (idParaFiltrar === 1) { // Si la categoría seleccionada es la que se muestra como 'Pañalería' (ID original 1)
        idParaFiltrar = 2; // Filtramos por las subcategorías con ID original 2 (que deberían ser 'Bebes' y 'Adultos')
      } else if (idParaFiltrar === 2) { // Si la categoría seleccionada es la que se muestra como 'Higiene' (ID original 2)
        idParaFiltrar = 1; // Filtramos por las subcategorías con ID original 1 (que deberían ser las de Higiene)
      }
      // **MODIFICACIÓN TERMINA AQUI**

      const subcategoriasDeLaCategoria = subcategorias.filter(
        sub => sub.id_categoria === idParaFiltrar
      );
      console.log('Subcategorías filtradas:', subcategoriasDeLaCategoria);
      setSubcategoriasFiltradas(subcategoriasDeLaCategoria);
      setSubcategoriaId(''); // Resetear subcategoría seleccionada
    } else {
      setSubcategoriasFiltradas([]);
      setSubcategoriaId('');
    }
  }, [categoriaId, subcategorias]);

  // ===============================
  // FUNCIONES DE API
  // ===============================
  
  const obtenerDatosIniciales = async () => {
    try {
      // Obtener categorías
      const categoriasResponse = await fetch(`http://localhost:${BACKEND_PORT}/api/catalogo/categorias`);
      const categoriasData = await categoriasResponse.json();
      // Invertir nombres para IDs 1 y 2 si es necesario para que coincidan con la visualización de catálogos
      const adjustedCategoriasData = categoriasData.map(cat => {
        if (cat.id_categoria === 1) return { ...cat, nombre: 'Pañalería' }; // Si ID 1 es Higiene en BD, mostrar como Pañalería
        if (cat.id_categoria === 2) return { ...cat, nombre: 'Higiene' };   // Si ID 2 es Pañalería en BD, mostrar como Higiene
        return cat; // Mantener otras categorías como están
      });
      setCategorias(adjustedCategoriasData.map(cat => ({ id_categoria: cat.id_categoria, nombre: cat.nombre })));

      // Obtener subcategorías
      const subcategoriasResponse = await fetch(`http://localhost:${BACKEND_PORT}/api/subcategorias`);
      const subcategoriasData = await subcategoriasResponse.json();
      console.log('Subcategorías cargadas:', subcategoriasData);
      setSubcategorias(subcategoriasData);

      // Obtener marcas
      const marcasResponse = await fetch(`http://localhost:${BACKEND_PORT}/api/catalogo/marcas`);
      const marcasData = await marcasResponse.json();
      setMarcas(marcasData.map(marca => ({ id_marca: marca.id_marca, nombre: marca.nombre })));

      // Obtener productos
      const productosResponse = await fetch(`http://localhost:${BACKEND_PORT}/api/catalogo/productos`);
      const productosData = await productosResponse.json();
      setProductos(productosData);

    } catch (error) {
      console.error('Error al obtener datos iniciales:', error);
      setMensaje('Error al cargar datos iniciales.');
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await fetch(`http://localhost:${BACKEND_PORT}/api/catalogo/productos`);
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      } else {
        console.error('Error al obtener productos:', response.status);
      }
    } catch (error) {
      console.error('Error de red al obtener productos:', error);
    }
  };

  const agregarAlCarrito = async (producto) => {
    const idUsuario = localStorage.getItem('idUsuario');
    if (!idUsuario) {
      navigate('/login');
      return;
    }

    try {
      let carritoActivo = null;
      const responseCarrito = await fetch(`http://localhost:${BACKEND_PORT}/api/carrito/activo/${idUsuario}`);

      if (responseCarrito.ok) {
        carritoActivo = await responseCarrito.json();
      } else if (responseCarrito.status === 404) {
        const responseCrear = await fetch(`http://localhost:${BACKEND_PORT}/api/carrito`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idUsuario: parseInt(idUsuario) }),
        });
        if (responseCrear.ok) {
          carritoActivo = await responseCrear.json();
        } else {
          console.error('Error al crear carrito:', responseCrear.statusText);
          setMensaje('Error al agregar producto al carrito.');
          return;
        }
      } else {
        console.error('Error al obtener carrito activo:', responseCarrito.statusText);
        setMensaje('Error al agregar producto al carrito.');
        return;
      }

      const detalle = {
        idVenta: carritoActivo.idVenta,
        id_producto: producto.id_producto,
        cantidad: 1
      };

      const responseDetalle = await fetch(`http://localhost:${BACKEND_PORT}/api/carrito/detalle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(detalle),
      });

      if (responseDetalle.ok) {
        setMensaje('Producto agregado al carrito!');
        fetchCarrito(parseInt(idUsuario));
      } else {
        console.error('Error al agregar detalle:', responseDetalle.statusText);
        setMensaje('Error al agregar producto al carrito.');
      }

    } catch (error) {
      console.error('Error de red al agregar al carrito:', error);
      setMensaje('Error de conexión al agregar producto.');
    }
  };

  // ===============================
  // MANEJADORES DE EVENTOS
  // ===============================
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    formData.append('stock', stock);
    formData.append('idCategoria', categoriaId);
    formData.append('idSubcategoria', subcategoriaId);
    formData.append('idMarca', marcaId);
    
    if (imagen) {
      formData.append('file', imagen);
    }

    // Debug
    console.log('Datos enviados:', {
      categoriaId,
      subcategoriaId,
      nombre,
      precio,
      stock,
      marcaId
    });

    try {
      const response = await fetch(`http://localhost:${BACKEND_PORT}/api/catalogo/productos`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (response.ok) {
        setMensaje('Producto agregado con éxito!');
        limpiarFormulario();
        fetchProductos();
      } else {
        setMensaje(`Error al agregar producto: S/.{data.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error al agregar producto:', error);
      setMensaje('Error de conexión al agregar producto.');
    }
  };

  // ===============================
  // FUNCIONES AUXILIARES
  // ===============================
  
  const limpiarFormulario = () => {
    setNombre('');
    setPrecio('');
    setStock('');
    setCategoriaId('');
    setSubcategoriaId('');
    setMarcaId('');
    setImagen(null);
    setMostrarFormulario(false);
  };

  const obtenerNombreSubcategoria = (idSubcategoria) => {
    const subcategoria = subcategorias.find(sub => sub.id_subcategoria === idSubcategoria);
    return subcategoria ? subcategoria.nombre : 'Sin subcategoría';
  };

  const obtenerNombreCategoria = (idCategoria) => {
    const categoria = categorias.find(cat => cat.id_categoria === idCategoria);
    return categoria ? categoria.nombre : 'Desconocida';
  };

  const obtenerNombreMarca = (idMarca) => {
    const marca = marcas.find(marca => marca.id_marca === idMarca);
    return marca ? marca.nombre : 'Desconocida';
  };

  // ===============================
  // COMPONENTES DE RENDERIZADO
  // ===============================
  
  const renderTablaProductos = () => (
    <div>
      {userRole === 'admin' && (
        <button onClick={() => setMostrarFormulario(true)}>
          Agregar Nuevo Producto
        </button>
      )}
      
      <h3>Lista de Productos</h3>
      
      {productos.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Subcategoría</th>
              <th>Marca</th>
              {userRole !== 'admin' && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.id_producto}>
                <td>{producto.nombre}</td>
                <td>S/.{producto.precio.toFixed(2)}</td>
                <td>{obtenerNombreCategoria(producto.id_categoria)}</td>
                <td>{obtenerNombreSubcategoria(producto.id_subcategoria)}</td>
                <td>{obtenerNombreMarca(producto.id_marca)}</td>
                {userRole !== 'admin' && (
                  <td>
                    <button
                      className="btn-comprar"
                      onClick={() => {
                        if (!userRole) {
                          navigate('/login');
                        } else {
                          agregarAlCarrito(producto);
                        }
                      }}
                    >
                      Comprar
                    </button>
                  </td>
                )}
                {userRole === 'admin' && (
                  <td>
                    <button onClick={() => {/* Lógica para editar si existe */}} disabled>Editar</button>
                    <button onClick={() => {/* Lógica para eliminar si existe */}} disabled>Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{mensaje || "No hay productos disponibles."}</p>
      )}
    </div>
  );

  const renderFormulario = () => (
    <form onSubmit={handleSubmit}>
      <h2>Ingresar Nuevo Producto</h2>
      
      <div>
        <label>Nombre:</label>
        <input 
          type="text" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          required 
        />
      </div>
      
      <div>
        <label>Precio:</label>
        <input 
          type="number" 
          step="0.01" 
          value={precio} 
          onChange={(e) => setPrecio(e.target.value)} 
          required 
        />
      </div>
      
      <div>
        <label>Stock:</label>
        <input 
          type="number" 
          value={stock} 
          onChange={(e) => setStock(e.target.value)} 
          required 
        />
      </div>
      
      <div>
        <label>Imagen:</label>
        <input 
          type="file" 
          onChange={(e) => setImagen(e.target.files[0])} 
        />
      </div>
      
      <div>
        <label>Categoría:</label>
        <select 
          value={categoriaId} 
          onChange={(e) => setCategoriaId(e.target.value)} 
          required
        >
          <option value="">Seleccione una categoría</option>
          {categorias.map(cat => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label>Subcategoría:</label>
        <select 
          value={subcategoriaId} 
          onChange={(e) => setSubcategoriaId(e.target.value)} 
          required
          disabled={!categoriaId}
        >
          <option value="">
            {categoriaId ? 'Seleccione una subcategoría' : 'Primero seleccione una categoría'}
          </option>
          {subcategoriasFiltradas.map(sub => (
            <option key={sub.id_subcategoria} value={sub.id_subcategoria}>
              {sub.nombre}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label>Marca:</label>
        <select 
          value={marcaId} 
          onChange={(e) => setMarcaId(e.target.value)} 
          required
        >
          <option value="">Seleccione una marca</option>
          {marcas.map(marca => (
            <option key={marca.id_marca} value={marca.id_marca}>
              {marca.nombre}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <button type="submit">Agregar Producto</button>
        <button type="button" onClick={() => setMostrarFormulario(false)}>
          Cancelar
        </button>
      </div>
    </form>
  );

  // ===============================
  // RENDER PRINCIPAL
  // ===============================
  
  return (
    <div className="productos-container">
      <h2>Gestión de Productos</h2>

      {mensaje && (
        <p className={mensaje.includes('Error') ? 'error' : 'success'}>
          {mensaje}
        </p>
      )}

      {!mostrarFormulario ? renderTablaProductos() : renderFormulario()}
    </div>
  );
}

export default Productos;