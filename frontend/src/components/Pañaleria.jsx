import React, { useState, useEffect } from "react";
import "../css/Pañaleria.css";

// Importar las imágenes locales para el carrusel
import bebeImg from "../imagenes/bebe.png";
import bebe2Img from "../imagenes/bebe3.png";
import pañal1Img from "../imagenes/pañal1.jpg";
import pañal2Img from "../imagenes/pañal2.jpg";
import pañal4Img from "../imagenes/pañal3.jpg";
import pañal5Img from "../imagenes/pañal4.jpg";
import pañal6Img from "../imagenes/pañal5.jpg";

// Carrusel (mantener la definición)
const Carrusel = () => {
  // Usamos las imágenes locales para el carrusel
  const images = [bebeImg, bebe2Img, pañal1Img, pañal2Img, pañal4Img, pañal5Img, pañal6Img];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 11000); // Ajusta el tiempo si quieres
    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = index => setCurrent(index);

  return (
    <div className="carrusel-container fade-in-carrusel"> {/* Asegúrate de tener las clases CSS para el carrusel */}
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
            className={`dot ${index === current ? "active" : ""}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

// Define el puerto de tu backend Java (por defecto 8081, cámbialo si lo modificaste)
const BACKEND_PORT = 8081;
// Define el ID de la categoría Pañalería (¡AJUSTA ESTE VALOR SI ES DIFERENTE EN TU BD!)
const CATEGORIA_ID = 2; // Asumiendo que Pañalería tiene ID 2

// Eliminar o comentar productosBase ya que ahora se cargarán de la BD
// const productosBase = [...];

// Cambiar el nombre de la función a Pañaleria
function Pañaleria() {
  const [productosPañaleria, setProductosPañaleria] = useState([]); // Estado para productos de la BD
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState(''); // Estado para mensajes
  const [userRole, setUserRole] = useState(localStorage.getItem('rol'));

  const categorias = ["Todos", "Bebé", "Adulto", "Higiene"]; // Mantener si filtras por subcategoría o tipo localmente

  // Nuevo useEffect para cargar productos desde el backend
  useEffect(() => {
    const obtenerProductosPañaleria = async () => {
      try {
        const response = await fetch(`http://localhost:${BACKEND_PORT}/api/catalogo/productos/categoria/${CATEGORIA_ID}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProductosPañaleria(data);
      } catch (error) {
        console.error('Error al obtener productos de Pañalería:', error);
        setMensaje('Error al cargar los productos de Pañalería.');
      }
    };

    obtenerProductosPañaleria();

    const handleStorageChange = () => {
      setUserRole(localStorage.getItem('rol'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => { // Cleanup
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

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

  const productosFiltrados = productosPañaleria.filter((producto) => {
    // Adapta la lógica de filtrado si las propiedades en tu entidad Producto.java son diferentes
    const coincideCategoria =
      categoriaActiva === "Todos" || (producto.categoria && producto.categoria === categoriaActiva); // Asumiendo que Producto.java tiene campo 'categoria'
    const coincideBusqueda = busqueda.trim() === '' || (
        (producto.nombre && producto.nombre.toLowerCase().includes(busqueda.toLowerCase()))
        // Agrega otras propiedades por las que quieras buscar si existen en tu entidad
        // || (producto.descripcion && producto.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
    );
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="higiene-wrapper"> {/* Clase CSS quizás necesite ser pañaleria-wrapper */}
      {/* Carrusel (descomentar para mostrar)*/}
      <Carrusel />

      <div className="filtro-lateral">
        <h3>Filtrar por:</h3>
        {categorias.map((cat) => (
          <button
            key={cat}
            className={`filtro-btn ${categoriaActiva === cat ? "activo" : ""}`}
            onClick={() => setCategoriaActiva(cat)}
          >
            {cat}
          </button>
        ))}
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="barra-busqueda"
        />
      </div>

      <div style={{ flex: 1 }}>
        <div className="banner">
          <img
            src={bebe2Img}  // Usar la imagen importada para el banner
            alt="Banner"
          />
          <div className="texto-banner">Bienvenido a Pañalera Claudia</div>
        </div>

        <div className="productos-grid">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto) => (
              <div className="card-producto" key={producto.id_producto}> {/* Usar id_producto como key */}
                 {/* Asegúrate de que la URL de la imagen sea accesible desde el frontend */}
                <img src={`http://localhost:${BACKEND_PORT}${producto.imagenUrl}`} alt={producto.nombre} />
                <div className="contenido">
                  <h4>{producto.nombre}</h4>
                   {/* <p>{producto.descripcion}</p> */} {/* Descomenta si tu entidad Producto tiene campo descripcion */}
                   {/* <p><strong>Marca:</strong> {producto.marca}</p> */} {/* Si quieres mostrar la marca, necesitarías cargar sus datos */}
                  <p><strong>Precio:</strong> S/ {producto.precio ? producto.precio.toFixed(2) : 'N/A'}</p> {/* Manejar posible null/undefined de precio */}
                   {/* <p><strong>Stock:</strong> {producto.stock}</p> */} {/* Descomenta si tu entidad Producto tiene campo stock */}
                  {userRole === 'cliente' && (
                    <button className="btn-comprar" onClick={() => agregarAlCarrito(producto)}>Comprar</button>
                  )}
                </div>
              </div>
            ))
          ) : (
             <p>{mensaje || "No hay productos en esta categoría."}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Exportar la función con el nombre corregido
export default Pañaleria;
