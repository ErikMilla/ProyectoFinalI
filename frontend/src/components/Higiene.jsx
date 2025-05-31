import React, { useState, useEffect } from 'react';
import '../css/Higiene.css';
// Importaciones de imágenes locales eliminadas, ahora se cargarán desde el backend

// Define el puerto de tu backend Java (por defecto 8081, cámbialo si lo modificaste)
const BACKEND_PORT = 8081;
// Define el ID de la categoría Higiene (¡AJUSTA ESTE VALOR SI ES DIFERENTE EN TU BD!)
const CATEGORIA_ID = 1;

// Carrusel (mantener si es necesario, pero no mostrará productos de la BD)
const Carrusel = () => {
  // Si quieres que el carrusel use imágenes de productos de la BD, necesitarías otra lógica
  const images = []; // Vacío por ahora, o podrías cargar imágenes destacadas de la BD

  const [current, setCurrent] = useState(0);

  // Efecto para el carrusel (mantener si hay imágenes, ajustar si vienen de BD)
  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrent(prev => (prev + 1) % images.length);
      }, 11000);
      return () => clearInterval(interval);
    }
    return () => {}; // Limpieza si no hay imágenes
  }, [images.length]);

  const goToSlide = index => setCurrent(index);

  if (images.length === 0) return null; // No mostrar carrusel si no hay imágenes

  return (
    <div className="carrusel-container fade-in-carrusel">
      <div className="carrusel" style={{
        width: `${images.length * 100}%`,
        transform: `translateX(-${(100 / images.length) * current}%)`,
        display: 'flex',
        transition: 'transform 1s ease-in-out'
      }}>
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Imagen ${index + 1}`}
            className="carrusel-image"
            style={{ width: `${100 / images.length}%` }}
          />
        ))}
      </div>
      <div className="dots-container">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`dot ${index === current ? "activo" : ""}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

// Datos de productos locales eliminados, ahora se cargarán de la BD
const productos = [];

const filtros = ['Todos', 'Shampoo', 'Pasta', 'Cepillo']; // Mantener si quieres filtrar por tipo en frontend

const Higiene = () => {
  const [productosHigiene, setProductosHigiene] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [userRole, setUserRole] = useState(localStorage.getItem('rol'));

  useEffect(() => {
    const obtenerProductosHigiene = async () => {
      try {
        const response = await fetch(`http://localhost:${BACKEND_PORT}/api/catalogo/productos/categoria/${CATEGORIA_ID}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProductosHigiene(data);
      } catch (error) {
        console.error('Error al obtener productos de Higiene:', error);
        setMensaje('Error al cargar los productos de Higiene.');
      }
    };

    obtenerProductosHigiene();

    const handleStorageChange = () => {
      setUserRole(localStorage.getItem('rol'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => { // Cleanup
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  const productosFiltrados = productosHigiene.filter((producto) => {
    // Asegúrate de que las propiedades del producto (nombre, tipo) coincidan con las de tu entidad Producto.java si filtras por ellas
    const coincideTipo = filtroActivo === 'Todos' || (producto.tipo && producto.tipo.toLowerCase() === filtroActivo.toLowerCase());
    const coincideBusqueda = busqueda.trim() === '' || (
      (producto.nombre && producto.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
      (producto.tipo && producto.tipo.toLowerCase().includes(busqueda.toLowerCase())) // Si tu entidad Producto tiene campo 'tipo'
    );
    return coincideTipo && coincideBusqueda;
  });

  // Nueva función para agregar al carrito
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
    <div className="fade-in-up">
      {/* Carrusel */}
      {/* <Carrusel /> */} {/* Descomenta si tienes imágenes para el carrusel */}

      {/* Barra de búsqueda */}
      <div className="barra-busqueda fade-in-down">
        <label htmlFor="busqueda">Buscar:</label>
        <input
          id="busqueda"
          type="text"
          placeholder="Nombre o tipo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="higiene-wrapper fade-in-left">
        {/* Filtro lateral (mantener si quieres filtrar por tipo)*/}
        <aside className="filtro-lateral">
          <h3>Filtrar por tipo</h3>
          {filtros.map((tipo) => (
            <button
              key={tipo}
              className={`filtro-btn ${filtroActivo === tipo ? 'activo' : ''}`}
              onClick={() => setFiltroActivo(tipo)}
            >
              {tipo}
            </button>
          ))}
        </aside>

        <main className="productos-grid">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto) => (
              <div key={producto.id_producto} className="card-producto fade-in-right">
                {/* Asegúrate de que la URL de la imagen sea accesible desde el frontend */}
                <img src={`http://localhost:${BACKEND_PORT}${producto.imagenUrl}`} alt={producto.nombre} />
                <div className="contenido">
                  <h4>{producto.nombre}</h4>
                  {/* <p>{producto.descripcion}</p> */} {/* Asegúrate de tener campo descripcion en tu entidad si lo usas */}
                  {/* <p><strong>Marca:</strong> {producto.marca}</p> */} {/* Si quieres mostrar la marca, necesitarías cargar los datos de la marca también */}
                  <p><strong>Precio:</strong> S/{producto.precio.toFixed(2)}</p>
                  {/* Asegúrate de que el producto tenga campo 'precio' y sea un número */}
                  <p><strong>Stock:</strong> {producto.stock}</p> {/* Asegúrate de que el producto tenga campo 'stock' */}
                  {userRole === 'cliente' && (
                    <button className="btn-comprar" onClick={() => agregarAlCarrito(producto)}>Comprar</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>{mensaje || "No hay productos en esta categoría."}</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Higiene;
