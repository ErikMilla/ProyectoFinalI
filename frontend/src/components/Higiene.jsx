import React, { useState, useEffect } from 'react';
import '../css/Higiene.css';
import shampooBebe from '../imagenes/shampoo.png';
import pastaInfantil from '../imagenes/pasta dental.png';
import cepilloSuave from '../imagenes/cepillo.png';
import shampooNatural from '../imagenes/shampoon.png';
import cepilloDedo from '../imagenes/cepillo2.png';
import pastaDental from '../imagenes/pasta.png';
import cepilloAdulto from '../imagenes/Cepillo3.png';

import colinos from '../imagenes/colinos.jpg';
import jhonson from '../imagenes/jhonson.jpg';
import shampusito from '../imagenes/shampusito.jpg';
import cepillo_bb from '../imagenes/cepillo_bb.png';

// Carrusel
const Carrusel = () => {
  const images = [cepillo_bb, jhonson, shampusito, colinos]; // Usamos las imágenes locales

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 11000);
    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = index => setCurrent(index);

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
            className={`dot ${index === current ? "active" : ""}`}
          ></button>
        ))}
      </div>
    </div>
  );
};
const productos = [
  { id: 1, nombre: 'Shampoo para Bebé', tipo: 'shampoo', imagen: shampooBebe, descripcion: 'Limpieza suave sin lágrimas.', precio: 15.00, marca: 'Marca A' },
  { id: 2, nombre: 'Pasta Dental Infantil', tipo: 'pasta', imagen: pastaInfantil, descripcion: 'Protege los dientes de leche.', precio: 12.50, marca: 'Marca B' },
  { id: 3, nombre: 'Cepillo Suave', tipo: 'cepillo', imagen: cepilloSuave, descripcion: 'Diseñado para encías delicadas.', precio: 10.00, marca: 'Marca C' },
  { id: 4, nombre: 'Shampoo Natural', tipo: 'shampoo', imagen: shampooNatural, descripcion: 'Ingredientes naturales para bebés.', precio: 18.00, marca: 'Marca A' },
  { id: 5, nombre: 'Cepillo de Dedo', tipo: 'cepillo', imagen: cepilloDedo, descripcion: 'Ideal para bebés pequeños.', precio: 8.00, marca: 'Marca D' },
  { id: 6, nombre: 'Pasta Dental', tipo: 'pasta', imagen: pastaDental, descripcion: 'Protege los dientes.', precio: 10.00, marca: 'Marca B' },
  { id: 7, nombre: 'Cepillo de Adulto', tipo: 'cepillo', imagen: cepilloAdulto, descripcion: 'Ideal para adultos.', precio: 12.00, marca: 'Marca C' },
];

const filtros = ['Todos', 'Shampoo', 'Pasta', 'Cepillo'];

const Higiene = () => {
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const productosFiltrados = productos.filter((producto) => {
    const coincideTipo = filtroActivo === 'Todos' || producto.tipo === filtroActivo.toLowerCase();
    const coincideBusqueda = busqueda.trim() === '' || (
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.tipo.toLowerCase().includes(busqueda.toLowerCase())
    );
    return coincideTipo && coincideBusqueda;
  });

  return (
    <div className="fade-in-up">
      {/* Carrusel */}
      <Carrusel />

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
          {productosFiltrados.map((producto) => (
            <div key={producto.id} className="card-producto fade-in-right">
              <img src={producto.imagen} alt={producto.nombre} />
              <div className="contenido">
                <h4>{producto.nombre}</h4>
                <p>{producto.descripcion}</p>
                <p><strong>Marca:</strong> {producto.marca}</p>
                <p><strong>Precio:</strong> S/{producto.precio.toFixed(2)}</p>
                <button className="btn-comprar">Comprar</button>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Higiene;
