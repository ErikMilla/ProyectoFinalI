import React, { useState, useEffect } from 'react';
import '../css/Productos.css'; // Importar el archivo CSS

function Productos() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [marcaId, setMarcaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [imagen, setImagen] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productos, setProductos] = useState([]);
  const [userRole, setUserRole] = useState(localStorage.getItem('rol'));

  // Define el puerto de tu backend Java (por defecto 8081, cámbialo si lo modificaste)
  const BACKEND_PORT = 8081;

  useEffect(() => {
    obtenerDatosIniciales();
    fetchProductos(); // Call the new fetchProducts function
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem('rol'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => { // Cleanup
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const obtenerDatosIniciales = async () => {
    try {
      // Obtener categorías del backend Java
      const categoriasResponse = await fetch(`http://localhost:${BACKEND_PORT}/api/catalogo/categorias`);
      const categoriasData = await categoriasResponse.json();
      // Asegúrate de que los objetos de categoría tengan campos 'id' y 'nombre'
      setCategorias(categoriasData.map(cat => ({ id: cat.id_categoria, nombre: cat.nombre })));

      // Obtener marcas del backend Java
      const marcasResponse = await fetch(`http://localhost:${BACKEND_PORT}/api/catalogo/marcas`);
      const marcasData = await marcasResponse.json();
       // Asegúrate de que los objetos de marca tengan campos 'id' y 'nombre'
      setMarcas(marcasData.map(marca => ({ id: marca.id_marca, nombre: marca.nombre })));

      // Obtener TODOS los productos del backend
      const productosResponse = await fetch(`http://localhost:${BACKEND_PORT}/api/catalogo/productos`);
      const productosData = await productosResponse.json();
      setProductos(productosData);

    } catch (error) {
      console.error('Error al obtener datos iniciales o productos:', error);
      setMensaje('Error al cargar datos iniciales o productos.');
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await fetch(`http://localhost:${BACKEND_PORT}/api/catalogo/productos`);
      if (response.ok) {
        const data = await response.json();
        setProductos(data); // Assuming the backend returns a list of products
      } else {
        console.error('Error al obtener la lista de productos:', response.status);
      }
    } catch (error) {
      console.error('Error de red al obtener la lista de productos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    formData.append('stock', stock);
    formData.append('idCategoria', categoriaId);
    formData.append('idMarca', marcaId);
    if (imagen) {
        formData.append('file', imagen);
    }

    try {
        // Envía el nuevo producto con imagen al backend Java
      const response = await fetch(`http://localhost:${BACKEND_PORT}/api/catalogo/productos`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('Producto agregado con éxito!');
        // Limpiar formulario y recargar lista de productos
        setNombre('');
        setPrecio('');
        setStock('');
        setCategoriaId('');
        setMarcaId('');
        setImagen(null);
        setMostrarFormulario(false);
        // Opcional: Volver a cargar la lista de productos después de agregar uno nuevo
        // obtenerDatosIniciales(); // Descomentar si quieres recargar la lista automáticamente

      } else {
        setMensaje(`Error al agregar producto: ${data.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error al agregar producto:', error);
      setMensaje('Error de conexión al agregar producto.');
    }
  };

  // Nueva función para agregar al carrito
  const agregarAlCarrito = async (producto) => {
    const idUsuario = localStorage.getItem('id');
    if (!idUsuario) {
      setMensaje('Debes iniciar sesión para comprar.');
      return;
    }
    try {
      const detalle = {
        idProducto: producto.idProducto,
        cantidad: 1
      };
      const res = await fetch(`http://localhost:${BACKEND_PORT}/api/carrito/${idUsuario}/agregar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(detalle)
      });
      if (res.ok) {
        setMensaje('Producto añadido al carrito.');
      } else {
        setMensaje('Error al añadir al carrito.');
      }
    } catch (error) {
      setMensaje('Error de conexión al añadir al carrito.');
    }
  };

  return (
    <div className="productos-container">
      <h2>Gestión de Productos</h2>

      {!mostrarFormulario && (
        <div>
          <button onClick={() => setMostrarFormulario(true)}>Agregar Nuevo Producto</button>
          <h3>Lista de Productos</h3>
          {productos.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Categoría</th>
                  <th>Marca</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(producto => (
                  <tr key={producto.idProducto}>
                    <td>{producto.nombre}</td>
                    <td>{producto.precio}</td>
                    <td>{producto.stock}</td>
                    <td>
                      {categorias.find(cat => cat.id === producto.idCategoria)?.nombre || 'Desconocida'}
                    </td>
                    <td>
                      {marcas.find(marca => marca.id === producto.idMarca)?.nombre || 'Desconocida'}
                    </td>
                    <td>
                      {userRole === 'cliente' && (
                        <button onClick={() => agregarAlCarrito(producto)}>Comprar</button>
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
      )}

      {mostrarFormulario && (
        <form onSubmit={handleSubmit}>
          <h2>Ingresar Nuevo Producto</h2>
          <div>
            <label>Nombre:</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div>
            <label>Precio:</label>
            <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
          </div>
          <div>
            <label>Stock:</label>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
          </div>
          <div>
            <label>Imagen:</label>
            <input type="file" onChange={(e) => setImagen(e.target.files[0])} />
          </div>
          <div>
            <label>Categoría:</label>
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
              <option value="">Seleccione una categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Marca:</label>
            <select value={marcaId} onChange={(e) => setMarcaId(e.target.value)} required>
              <option value="">Seleccione una marca</option>
              {marcas.map(marca => (
                <option key={marca.id} value={marca.id}>{marca.nombre}</option>
              ))}
            </select>
          </div>
          <button type="submit">Agregar Producto</button>
        </form>
      )}

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default Productos; 