import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Layout.css';

const Layout = ({ children }) => {
  const [nombre, setNombre] = useState(localStorage.getItem('nombre'));
  const [rol, setRol] = useState(localStorage.getItem('rol'));
  const [menuAbierto, setMenuAbierto] = useState(false);
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

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <div className="layout">
      <nav className="navbar-custom">
        <div className="nav-left">
          <Link to="/" className="brand">
            <span role="img" aria-label="logo">🍼</span> Pañalería <span className="brand-highlight">Claudia</span>
          </Link>

          <button className="hamburger" onClick={toggleMenu}>
            {menuAbierto ? '✖️' : '☰'}
          </button>
        </div>

        <div className={`nav-links-custom ${menuAbierto ? 'show' : ''}`}>
          <Link to="/" onClick={() => setMenuAbierto(false)}>Inicio</Link>
          <Link to="/pañaleria" onClick={() => setMenuAbierto(false)}>Pañalería</Link>
          <Link to="/higiene" onClick={() => setMenuAbierto(false)}>Higiene</Link>
          
          {!isLoggedIn && (
            <>
              <Link to="/login" className="icon-link" onClick={() => setMenuAbierto(false)}>
                <span role="img" aria-label="login">🔑</span> Iniciar sesión
              </Link>
              <Link to="/registrar" className="icon-link" onClick={() => setMenuAbierto(false)}>
                <span role="img" aria-label="register">👤</span> Registrarse
              </Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <span className="icon-link user-name">
                <span role="img" aria-label="user">👤</span> {nombre || 'Usuario'}
              </span>
              <button className="icon-link" onClick={() => { handleLogout(); setMenuAbierto(false); }}>
                <span role="img" aria-label="logout">🚪</span> Cerrar sesión
              </button>
            </>
          )}
        </div>

        <div className="nav-right">
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
            <a href="https://www.facebook.com" className="facebook" target="_blank" rel="noopener noreferrer"></a>
            <a href="https://www.instagram.com/vice_1099/" className="instagram" target="_blank" rel="noopener noreferrer"></a>
            <a href="https://wa.me/51935532263" className="whatsapp" target="_blank" rel="noopener noreferrer"></a>
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
            <li>Mza.C-10-Int 65-Lote 3Urb. Las Banderas-Prov.Const.del Callo</li>
            <li>+51 935 532 264</li>
            <li><a href="mailto:contacto@panaleriaclaudia.com">contacto@pañaleriaclaudia.com</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
