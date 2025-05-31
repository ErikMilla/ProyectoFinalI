"use client"

import { Link } from "react-router-dom"
import "../css/Home.css"
import { useEffect } from "react"

const Home = () => {
  // Efecto para asegurar que las animaciones se ejecuten correctamente al cargar la página
  useEffect(() => {
    // Añadir clase al body para indicar que la página está cargada
    document.body.classList.add("page-loaded")

    // Opcional: Scroll al inicio de la página cuando se carga
    window.scrollTo(0, 0)

    return () => {
      // Limpiar al desmontar
      document.body.classList.remove("page-loaded")
    }
  }, [])

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>
            Todo para el cuidado
            <span className="highlight">de tu bebé</span>
          </h1>
          <p>Productos de calidad premium al mejor precio del mercado</p>
          <div className="hero-buttons">
            <Link to="/productos" className="btn btn-primary">
              <span>Ver productos</span>
            </Link>
            <Link to="/promociones" className="btn btn-secondary">
              Ofertas especiales
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg" alt="Bebé feliz" />
        </div>
      </div>

      <div className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🚚</span>
              <h3>Envío Gratis</h3>
              <p>En pedidos superiores a S/100 a todo el Perú</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⭐</span>
              <h3>Calidad Premium</h3>
              <p>Productos certificados de las mejores marcas</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">💰</span>
              <h3>Mejores Precios</h3>
              <p>Garantizamos el mejor precio del mercado o te devolvemos la diferencia</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔒</span>
              <h3>Compra Segura</h3>
              <p>Pago seguro y protegido con garantía de satisfacción</p>
            </div>
          </div>
        </div>
      </div>

      <div className="categories">
        <div className="container">
          <h2>Nuestras Categorías</h2>
          <div className="categories-grid">
            <Link to="/pañaleria" className="category-card">
              <img src="https://images.pexels.com/photos/3662909/pexels-photo-3662909.jpeg" alt="Pañales" />
              <div className="category-content">
                <h3>Pañales</h3>
                <p>Las mejores marcas en pañales para cada etapa</p>
              </div>
            </Link>
            <Link to="/higiene" className="category-card">
              <img src="https://images.pexels.com/photos/3738095/pexels-photo-3738095.jpeg" alt="Higiene" />
              <div className="category-content">
                <h3>Higiene</h3>
                <p>Productos suaves y seguros para el cuidado diario</p>
              </div>
            </Link>
            <Link to="/accesorios" className="category-card">
              <img src="https://images.pexels.com/photos/3661387/pexels-photo-3661387.jpeg" alt="Accesorios" />
              <div className="category-content">
                <h3>Accesorios</h3>
                <p>Todo lo que necesitas para el confort de tu bebé</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="featured-products">
        <div className="container">
          <div className="featured-products-header">
            <h2>Productos Destacados</h2>
            <p>Nuestra selección de los productos más populares y con mejor valoración por nuestros clientes.</p>
          </div>
          <div className="products-grid">
            <div className="product-card">
              <div className="product-image">
                <span className="product-badge badge-offer">Oferta</span>
                <button className="favorite-btn" aria-label="Añadir a favoritos">
                  ❤
                </button>
                <img
                  src="https://images.pexels.com/photos/3662909/pexels-photo-3662909.jpeg"
                  alt="Pañales Ecológicos Premium"
                />
              </div>
              <div className="product-info">
                <h3 className="product-title">Pañales Ecológicos Premium Talla M</h3>
                <div className="product-price">
                  <span className="current-price">S/42.99</span>
                  <span className="original-price">S/54.99</span>
                </div>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image">
                <button className="favorite-btn" aria-label="Añadir a favoritos">
                  ❤
                </button>
                <img
                  src="https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg"
                  alt="Set de Biberones Anticólicos"
                />
              </div>
              <div className="product-info">
                <h3 className="product-title">Set de Biberones Anticólicos</h3>
                <div className="product-price">
                  <span className="current-price">S/35.99</span>
                </div>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image">
                <span className="product-badge badge-new">Nuevo</span>
                <button className="favorite-btn" aria-label="Añadir a favoritos">
                  ❤
                </button>
                <img
                  src="https://images.pexels.com/photos/3738095/pexels-photo-3738095.jpeg"
                  alt="Crema Hidratante para Bebé"
                />
              </div>
              <div className="product-info">
                <h3 className="product-title">Crema Hidratante para Bebé 250ml</h3>
                <div className="product-price">
                  <span className="current-price">S/18.50</span>
                </div>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image">
                <span className="product-badge badge-offer">Oferta</span>
                <button className="favorite-btn" aria-label="Añadir a favoritos">
                  ❤
                </button>
                <img
                  src="https://images.pexels.com/photos/3661387/pexels-photo-3661387.jpeg"
                  alt="Mochila Cambiador Multifunción"
                />
              </div>
              <div className="product-info">
                <h3 className="product-title">Mochila Cambiador Multifunción</h3>
                <div className="product-price">
                  <span className="current-price">S/69.99</span>
                  <span className="original-price">S/89.99</span>
                </div>
              </div>
            </div>
          </div>
          <Link to="/productos" className="view-all-btn">
            Ver todos los productos
          </Link>
        </div>
      </div>

      {/* Info Bar - Ahora arriba de la newsletter */}
      <div className="info-bar">
        <div className="container">
          <div className="info-item">
            <div className="info-icon">🚚</div>
            <div className="info-content">
              <h3>Envío Gratis</h3>
              <p>En pedidos superiores a $50</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">⏱️</div>
            <div className="info-content">
              <h3>Entrega Rápida</h3>
              <p>24-48 horas en tu domicilio</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">🏆</div>
            <div className="info-content">
              <h3>Calidad Garantizada</h3>
              <p>Productos certificados y seguros</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="newsletter">
        <div className="newsletter-container">
          <h2>Únete a nuestra newsletter</h2>
          <p>Suscríbete para recibir las últimas novedades, consejos de cuidado para bebés y ofertas exclusivas.</p>
          <form className="newsletter-form">
            <input type="email" className="newsletter-input" placeholder="Tu dirección de email" required />
            <button type="submit" className="newsletter-btn">
              Suscribirse <span>✉️</span>
            </button>
          </form>
          <p className="newsletter-disclaimer">
            Al suscribirte, aceptas nuestra política de privacidad. Puedes darte de baja en cualquier momento.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
