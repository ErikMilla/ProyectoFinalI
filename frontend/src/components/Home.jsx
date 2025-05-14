import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <h1>Bienvenido a Mi Tienda</h1>
        <p>Tu destino para productos de alimentación y pañalería</p>
        <div className="cta-buttons">
          <Link to="/alimentacion" className="cta-button">Ver Alimentación</Link>
          <Link to="/pañaleria" className="cta-button">Ver Pañalería</Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Alimentación</h3>
          <p>Encuentra los mejores productos alimenticios para tu familia</p>
          <Link to="/alimentacion">Explorar</Link>
        </div>
        <div className="feature-card">
          <h3>Pañalería</h3>
          <p>Productos de calidad para el cuidado de tu bebé</p>
          <Link to="/pañaleria">Explorar</Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 