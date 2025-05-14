import React, { useState } from 'react';
import './Higiene.css';

const Higiene = () => {
  const [productos, setProductos] = useState([]);
  //const [filtro, setFiltro] = useState('todos');
  const [nuevo, setNuevo] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
   // categoria: 'otros'
  });

  const handleChange = e => setNuevo({ ...nuevo, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setProductos([...productos, { ...nuevo, id: Date.now() }]);
    setNuevo({ nombre: '', descripcion: '', precio: '', imagen: '' });
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter(producto => producto.id !== id));
  };

  //const productosFiltrados = productos.filter(producto => {
    //if (filtro === 'todos') return true;
    //return producto.categoria === filtro;
  //});

  return (
    <div className="higiene-container">
    <h1>Productos de Higiene</h1>
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
            <p className="producto-precio"><span>S/.</span>{producto.precio}</p>
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
    //<div className="higiene-container">
      //<h1>Productos de Higiene</h1>
      //<div className="filtros">
        //<button 
          //className={`filtro-btn ${filtro === 'todos' ? 'activo' : ''}`}
          //onClick={() => setFiltro('todos')}
        //>
          //Todos
        //</button>
        //<button 
          //className={`filtro-btn ${filtro === 'jabones' ? 'activo' : ''}`}
          //onClick={() => setFiltro('jabones')}
        //>
          //Jabones
        //</button>
        //<button 
          //className={`filtro-btn ${filtro === 'toallitas' ? 'activo' : ''}`}
          //onClick={() => setFiltro('toallitas')}
        //>
          //Toallitas
        //</button>
        //<button 
          //className={`filtro-btn ${filtro === 'otros' ? 'activo' : ''}`}
          //onClick={() => setFiltro('otros')}
        //>
          //Otros
        //</button>
      //</div>
      //<form onSubmit={handleSubmit} className="form-agregar-producto">
        //<input name="nombre" value={nuevo.nombre} onChange={handleChange} placeholder="Nombre" required />
        //<input name="descripcion" value={nuevo.descripcion} onChange={handleChange} placeholder="Descripción" required />
        //<input name="precio" value={nuevo.precio} onChange={handleChange} placeholder="Precio" required />
        //<input name="imagen" value={nuevo.imagen} onChange={handleChange} placeholder="URL de imagen" required />
        //<select name="categoria" value={nuevo.categoria} onChange={handleChange} required>
          //<option value="jabones">Jabones</option>
          //<option value="toallitas">Toallitas</option>
          //<option value="otros">Otros</option>
        //</select>
        //<button type="submit">Agregar producto</button>
      //</form>
      //<div className="productos-grid">
        //{productosFiltrados.map((producto) => (
          //<div key={producto.id} className="producto-card">
            //<img src={producto.imagen} alt={producto.nombre} className="producto-imagen" />
            //<div className="producto-info">
              //<span className="producto-categoria">{producto.categoria}</span>
              //<h3>{producto.nombre}</h3>
              //<p className="producto-descripcion">{producto.descripcion}</p>
              //<p className="producto-precio">S/.{producto.precio}</p>
              //<button className="agregar-carrito">Agregar al Carrito</button>
              //<button
                //className="eliminar-producto"
                //onClick={() => eliminarProducto(producto.id)}
                //style={{ marginLeft: 8, background: '#f44336', color: 'white', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}
              //>
                //Eliminar
              //</button>
            //</div>
          //</div>
        //))}
      //</div>
    //</div>
  //);
//};

export default Higiene;
