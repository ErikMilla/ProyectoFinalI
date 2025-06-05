import React, { useState, useEffect } from 'react';
import '../css/Productos.css';

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
      const subcategoriasDeLaCategoria = subcategorias.filter(
        sub => sub.id_categoria === parseInt(categoriaId)
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
      setCategorias(categoriasData.map(cat => ({ id: cat.id_categoria, nombre: cat.nombre })));

      // Obtener subcategorías
      const subcategoriasResponse = await fetch(`http://localhost:${BACKEND_PORT}/api/subcategorias`);
      const subcategoriasData = await subcategoriasResponse.json();
      console.log('Subcategorías cargadas:', subcategoriasData);
      setSubcategorias(subcategoriasData);

      // Obtener marcas
      const marcasResponse = await fetch(`http://localhost:${BACKEND_PORT}/api/catalogo/marcas`);
      const marcasData = await marcasResponse.json();
      setMarcas(marcasData.map(marca => ({ id: marca.id_marca, nombre: marca.nombre })));

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
    const idUsuario = localStorage.getItem('id');
    if (!idUsuario) {
      setMensaje('Debes iniciar sesión para comprar.');
      return;
    }

    try {
      const detalle = {
        idProducto: producto.id_producto,
        cantidad: 1
      };

      const response = await fetch(`http://localhost:${BACKEND_PORT}/api/carrito/${idUsuario}/agregar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(detalle)
      });

      if (response.ok) {
        setMensaje('Producto añadido al carrito.');
      } else {
        setMensaje('Error al añadir al carrito.');
      }
    } catch (error) {
      setMensaje('Error de conexión al añadir al carrito.');
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
        setMensaje(`Error al agregar producto: ${data.message || response.statusText}`);
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
    const categoria = categorias.find(cat => cat.id === idCategoria);
    return categoria ? categoria.nombre : 'Desconocida';
  };

  const obtenerNombreMarca = (idMarca) => {
    const marca = marcas.find(marca => marca.id === idMarca);
    return marca ? marca.nombre : 'Desconocida';
  };

  // ===============================
  // COMPONENTES DE RENDERIZADO
  // ===============================
  
  const renderTablaProductos = () => (
    <div>
      <button onClick={() => setMostrarFormulario(true)}>
        Agregar Nuevo Producto
      </button>
      
      <h3>Lista de Productos</h3>
      
      {productos.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Subcategoría</th>
              <th>Marca</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.id_producto}>
                <td>{producto.nombre}</td>
                <td>${producto.precio}</td>
                <td>{producto.stock}</td>
                <td>{obtenerNombreCategoria(producto.idCategoria)}</td>
                <td>{obtenerNombreSubcategoria(producto.idSubcategoria)}</td>
                <td>{obtenerNombreMarca(producto.idMarca)}</td>
                <td>
                  {userRole === 'cliente' && (
                    <button onClick={() => agregarAlCarrito(producto)}>
                      Comprar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay productos disponibles.</p>
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
            <option key={cat.id} value={cat.id}>
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
            <option key={marca.id} value={marca.id}>
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

      {!mostrarFormulario ? renderTablaProductos() : renderFormulario()}

      {mensaje && (
        <p className={mensaje.includes('Error') ? 'error' : 'success'}>
          {mensaje}
        </p>
      )}
    </div>
  );
}

export default Productos;