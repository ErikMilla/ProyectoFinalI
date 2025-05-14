import React, { useState, useEffect } from 'react';
import './Pañaleria.css';

const Pañaleria = () => {
  const [productos, setProductos] = useState([]);
   // Estado para el formulario
   const [nuevo, setNuevo] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: ''
  });

  // Manejar cambios en el formulario
  const handleChange = e => setNuevo({ ...nuevo, [e.target.name]: e.target.value });

  // Agregar producto al array
  const handleSubmit = e => {
    e.preventDefault();
    setProductos([...productos, { ...nuevo, id: Date.now() }]);
    setNuevo({ nombre: '', descripcion: '', precio: '', imagen: '' });
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter(producto => producto.id !== id));
  };

 // const [loading, setLoading] = useState(true);
  //const [error, setError] = useState('');

  //useEffect(() => {
    //const fetchProductos = async () => {
      //try {
        //const response = await fetch('http://localhost:8081/api/productos/pañaleria');
        //if (response.ok) {
          //const data = await response.json();
          //setProductos(data);
        //} else {
          //setError('Error al cargar los productos');
        //}
      //} catch (err) {
        //setError('Error al conectar con el servidor');
      //} finally {
        //setLoading(false);
      //}
    //  };

    //fetchProductos();
  //}, []);

  //if (loading) {
    //return <div className="loading">Cargando productos...</div>;
  //}

  //if (error) {
    //return <div className="error">{error}</div>;
  //}

  return (
    <div className="pañaleria-container">
    <h1>Productos de Pañalería</h1>
    {/* Formulario para agregar productos */}
    <form onSubmit={handleSubmit} className="form-agregar-producto">
      <input name="nombre" value={nuevo.nombre} onChange={handleChange} placeholder="Nombre" required />
      <input name="descripcion" value={nuevo.descripcion} onChange={handleChange} placeholder="Descripción" required />
      <input name="precio" value={nuevo.precio} onChange={handleChange} placeholder="Precio" required />
      <input name="imagen" value={nuevo.imagen} onChange={handleChange} placeholder="URL de imagen" required />
      <button type="submit">Agregar producto</button>
    </form>
    <div className="productos-grid">
      {productos.map((producto) => (
        <div key={producto.id} className="producto-card">
          <img src={producto.imagen} alt={producto.nombre} className="producto-imagen" />
          <div className="producto-info">
            <h3>{producto.nombre}</h3>
            <p className="producto-descripcion">{producto.descripcion}</p>
            <p className="producto-precio">${producto.precio}</p>
            <button className="agregar-carrito">Agregar al Carrito</button>
            <button
              className="eliminar-producto"
              onClick={() => eliminarProducto(producto.id)}
              style={{ marginLeft: 8, background: '#f44336', color: 'white', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
};
  //  <div className="pañaleria-container">
  //    <h1>Productos de Pañalería</h1>
      //<div className="productos-grid">
        //{productos.map((producto) => (
          //<div key={producto.id} className="producto-card">
            //<img src={producto.imagen} alt={producto.nombre} className="producto-imagen" />
            //<div className="producto-info">
              //<h3>{producto.nombre}</h3>
              //<p className="producto-descripcion">{producto.descripcion}</p>
              //<p className="producto-precio">${producto.precio}</p>
              //<button className="agregar-carrito">Agregar al Carrito</button>
            //</div>
          //</div>
        //))}
      //</div>
    //</div>
  //);
//};

export default Pañaleria;
