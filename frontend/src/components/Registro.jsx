import React, { useState, useEffect } from 'react';
import '../css/Registro.css'; // Importar el archivo CSS

function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    password: '',
    confirmPassword: ''
  });
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem('rol'));
  const [filtroRol, setFiltroRol] = useState('todos'); // Estado para el filtro

  // Puerto backend Java
  const BACKEND_PORT = 8081;

  useEffect(() => {
    fetchUsuarios();
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem('rol'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Efecto para filtrar usuarios cuando cambia el filtro o la lista de usuarios
  useEffect(() => {
    filtrarUsuarios();
  }, [usuarios, filtroRol]);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`http://localhost:${BACKEND_PORT}/api/admin/usuarios`);
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        console.error('Error al obtener la lista de usuarios:', response.status);
      }
    } catch (error) {
      console.error('Error de red al obtener la lista de usuarios:', error);
    }
  };

  const filtrarUsuarios = () => {
    if (filtroRol === 'todos') {
      setUsuariosFiltrados(usuarios);
    } else {
      const filtrados = usuarios.filter(usuario => 
        usuario.rol.toLowerCase() === filtroRol.toLowerCase()
      );
      setUsuariosFiltrados(filtrados);
    }
  };

  const handleFiltroChange = (e) => {
    setFiltroRol(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (formData.password !== formData.confirmPassword) {
      setMensaje('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch(`http://localhost:${BACKEND_PORT}/api/admin/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          email: formData.email,
          telefono: formData.telefono,
          direccion: formData.direccion,
          contraseña: formData.password,
          confirmarcontraseña: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('Administrador registrado con éxito!');
        // Limpiar formulario
        setFormData({
          nombre: '',
          apellidos: '',
          email: '',
          telefono: '',
          direccion: '',
          password: '',
          confirmPassword: ''
        });
        setMostrarFormulario(false);
        // Recargar lista de usuarios
        fetchUsuarios();
      } else {
        setMensaje(data.message || 'Error al registrar administrador');
      }
    } catch (error) {
      console.error('Error al registrar administrador:', error);
      setMensaje('Error de conexión al registrar administrador.');
    }
  };

  return (
    <div className="registro-container">
      <h2>Gestión de Administradores</h2>

      {!mostrarFormulario && (
        <div>
          <div className="controls-section">
            <button onClick={() => setMostrarFormulario(true)}>
              Registrar Nuevo Administrador
            </button>
            
            <div className="filtro-container">
              <label htmlFor="filtro-rol">Filtrar por rol:</label>
              <select 
                id="filtro-rol"
                value={filtroRol} 
                onChange={handleFiltroChange}
                className="filtro-select"
              >
                <option value="todos">Todos los usuarios</option>
                <option value="admin">Administradores</option>
                <option value="cliente">Clientes</option>
              </select>
            </div>
          </div>

          <h3>
            Lista de Usuarios 
            {filtroRol !== 'todos' && (
              <span className="filtro-activo">
                - Mostrando: {filtroRol === 'admin' ? 'Administradores' : 'Clientes'}
              </span>
            )}
          </h3>
          
          {usuariosFiltrados.length > 0 ? (
            <div className="tabla-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellidos</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Fecha Creación</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map(usuario => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.apellidos}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.telefono}</td>
                      <td>
                        <span className={`rol-badge ${usuario.rol.toLowerCase()}`}>
                          {usuario.rol}
                        </span>
                      </td>
                      <td>{new Date(usuario.fechacreacion).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-usuarios">
              {filtroRol === 'todos' 
                ? 'No hay usuarios registrados.' 
                : `No hay usuarios con rol "${filtroRol === 'admin' ? 'Administrador' : 'Cliente'}" registrados.`
              }
            </p>
          )}
        </div>
      )}

      {mostrarFormulario && (
        <div className="form-overlay">
          <form onSubmit={handleSubmit} className="form-modal">
            <button 
              type="button" 
              className="close-button"
              onClick={() => setMostrarFormulario(false)}
            >
              ✕
            </button>
            
            <h2>Registrar Nuevo Administrador</h2>
            
            <div className="form-grid">
              <div className="input-group">
                <label>Nombre:</label>
                <input 
                  type="text" 
                  name="nombre"
                  value={formData.nombre} 
                  onChange={handleChange} 
                  placeholder="Nombres"
                  required 
                />
              </div>
              
              <div className="input-group">
                <label>Apellidos:</label>
                <input 
                  type="text" 
                  name="apellidos"
                  value={formData.apellidos} 
                  onChange={handleChange}
                  placeholder="Apellidos" 
                  required 
                />
              </div>
              
              <div className="input-group">
                <label>Email:</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email} 
                  onChange={handleChange}
                  placeholder="Correo Electrónico" 
                  required 
                />
              </div>
              
              <div className="input-group">
                <label>Teléfono:</label>
                <input 
                  type="text" 
                  name="telefono"
                  value={formData.telefono} 
                  onChange={handleChange}
                  placeholder="Teléfono" 
                  required 
                />
              </div>
              
              <div className="input-group full-width">
                <label>Dirección:</label>
                <input 
                  type="text" 
                  name="direccion"
                  value={formData.direccion} 
                  onChange={handleChange}
                  placeholder="Dirección" 
                  required 
                />
              </div>
              
              <div className="input-group">
                <label>Contraseña:</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password} 
                  onChange={handleChange}
                  placeholder="Contraseña" 
                  required 
                />
              </div>
              
              <div className="input-group">
                <label>Confirmar Contraseña:</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword} 
                  onChange={handleChange}
                  placeholder="Confirmar Contraseña" 
                  required 
                />
              </div>
            </div>
            
            <div className="form-buttons">
              <button type="submit" className="submit-button">
                Registrar Administrador
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {mensaje && (
        <div className={`mensaje ${mensaje.includes('éxito') ? 'success-message' : 'error-message'}`}>
          {mensaje}
        </div>
      )}
    </div>
  );
}

export default Registro;