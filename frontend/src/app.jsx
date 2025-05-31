import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Pañaleria from './components/Pañaleria';
import Higiene from './components/Higiene';
import Intranet from './components/Intranet';
import IntranetLayout from './components/IntranetLayout';
import Dashboard from './components/Dashboard';
import Proveedores from './components/Proveedores';
import Productos from './components/Productos';
import Carrito from './components/Carrito';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout><LoginForm /></Layout>} />
        <Route path="/registrar" element={<Layout><RegisterForm /></Layout>} />
        <Route path="/pañaleria" element={<Layout><Pañaleria /></Layout>} />
        <Route path="/higiene" element={<Layout><Higiene /></Layout>} />
        
        <Route path="/intranet" element={<IntranetLayout />} >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="proveedores" element={<Proveedores />} />
          <Route path="productos" element={<Productos />} />
        </Route>

        <Route path="/carrito" element={<Layout><Carrito /></Layout>} />

      </Routes>
    </Router>
  );
}

export default App;