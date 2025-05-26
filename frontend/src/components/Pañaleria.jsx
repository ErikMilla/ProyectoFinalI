import React, { useState } from "react";
import "../css/Pañaleria.css";

// Importar las imágenes
import bebeImg from "../imagenes/bebe.png";
import bebe2Img from "../imagenes/bebe3.png";
import pañal1Img from "../imagenes/pañal1.jpg";
import pañal2Img from "../imagenes/pañal2.jpg";
import pañal4Img from "../imagenes/pañal3.jpg";
import pañal5Img from "../imagenes/pañal4.jpg";
import pañal6Img from "../imagenes/pañal5.jpg";  // Asegúrate de que esta imagen exista

const productosBase = [
  {
    id: 1,
    nombre: "Pañal Babysec Premium",
    categoria: "Bebé",
    descripcion: "Pañales ultra absorbentes para bebés.",
    precio: 32.5,
    imagen: bebeImg,
  },
  {
    id: 2,
    nombre: "Pañal Plenitud Adulto",
    categoria: "Adulto",
    descripcion: "Protección cómoda para adultos.",
    precio: 45.9,
    imagen: pañal1Img,
  },
  {
    id: 3,
    nombre: "Toallitas Húmedas Huggies",
    categoria: "Higiene",
    descripcion: "Toallitas suaves con aloe vera.",
    precio: 12.0,
    imagen: pañal2Img,
  },
  {
    id: 4,
    nombre: "Toallitas Húmedas Huggies",
    categoria: "Higiene",
    descripcion: "Toallitas suaves con aloe vera.",
    precio: 12.0,
    imagen: pañal4Img,
  },
  {
    id: 5,
    nombre: "Toallitas Húmedas Huggies",
    categoria: "Higiene",
    descripcion: "Toallitas suaves con aloe vera.",
    precio: 12.0,
    imagen: pañal5Img,
  },
  {
    id: 6,
    nombre: "Toallitas Húmedas Huggies",
    categoria: "Higiene",
    descripcion: "Toallitas suaves con aloe vera.",
    precio: 12.0,
    imagen: pañal6Img,
  },
];


function App() {
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const categorias = ["Todos", "Bebé", "Adulto", "Higiene"];

  const productosFiltrados = productosBase.filter((producto) => {
    const coincideCategoria =
      categoriaActiva === "Todos" || producto.categoria === categoriaActiva;
    const coincideBusqueda = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="higiene-wrapper">
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
          {productosFiltrados.map((producto) => (
            <div className="card-producto" key={producto.id}>
              <img src={producto.imagen} alt={producto.nombre} />
              <div className="contenido">
                <h4>{producto.nombre}</h4>
                <p>{producto.descripcion}</p>
                <p><strong>S/ {producto.precio.toFixed(2)}</strong></p>
                <button className="btn-comprar">Comprar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
