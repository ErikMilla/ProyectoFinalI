import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const [nombre, setNombre] = useState(localStorage.getItem('nombre'));
  const [rol, setRol] = useState(localStorage.getItem('rol'));
  const isLoggedIn = !!rol;

  useEffect(() => {
    const onStorage = () => {
      setNombre(localStorage.getItem('nombre'));
      setRol(localStorage.getItem('rol'));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('storage'));
    window.location.href = '/';
  };

  return (
    <div className="layout">
      <nav className="navbar-custom">
        <div className="nav-left">
          <Link to="/" className="brand">
            <span role="img" aria-label="logo">🍼</span> Pañalería <span className="brand-highlight">Claudia</span>
          </Link>
          <div className="nav-links-custom">
            <Link to="/">Inicio</Link>
            <Link to="/pañaleria">Pañalería</Link>
            <Link to="/higiene">Higiene</Link>
          </div>
        </div>
        <div className="nav-right">
      {!isLoggedIn && (
        <>
          <Link to="/login" className="icon-link">
            <span role="img" aria-label="login">🔑</span> Iniciar sesión
          </Link>
          <Link to="/registrar" className="icon-link">
            <span role="img" aria-label="register">👤</span> Registrarse
          </Link>
        </>
      )}
      {isLoggedIn && (
        <>
          <span className="icon-link user-name">
            <span role="img" aria-label="user">👤</span> {nombre || 'Usuario'}
          </span>
          <button
            className="icon-link"
            onClick={handleLogout}
          >
            <span role="img" aria-label="logout">🚪</span> Cerrar sesión
          </button>
        </>
      )}
          <span className="icon-link"><span role="img" aria-label="search">🔍</span></span>
          <span className="icon-link"><span role="img" aria-label="cart">🛒</span></span>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
      <footer className="footer-custom">
        <div className="footer-col">
          <div className="footer-brand">
            <span className="brand-highlight">Pañalería Claudia</span>
          </div>
          <p>
            Todo lo que necesitas para el cuidado de tu bebé, con los mejores precios y la mejor calidad.
          </p>
          <div className="footer-social">
            <a href="#"><span role="img" aria-label="facebook">📘</span></a>
            <a href="#"><span role="img" aria-label="instagram">📸</span></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Enlaces rápidos</h4>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/pañaleria">Productos</Link></li>
            <li><Link to="/promociones">Promociones</Link></li>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Información</h4>
          <ul>
            <li><a href="#">Términos y condiciones</a></li>
            <li><a href="#">Política de privacidad</a></li>
            <li><a href="#">Política de envíos</a></li>
            <li><a href="#">Devoluciones</a></li>
            <li><a href="#">Preguntas frecuentes</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contacto</h4>
          <ul>
            <li>Av. Principal 123, Ciudad de México, México</li>
            <li>+52 55 1234 5678</li>
            <li><a href="mailto:contacto@panaleriaclaudia.com">contacto@panaleriaclaudia.com</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Layout;