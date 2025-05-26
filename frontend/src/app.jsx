import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Pañaleria from './components/Pañaleria';
import Higiene from './components/Higiene';
import Intranet from './components/Intranet';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/registrar" element={<RegisterForm />} />
          <Route path="/pañaleria" element={<Pañaleria />} />
          <Route path="/higiene" element={<Higiene />} />
          <Route path="/intranet" element={<Intranet />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;