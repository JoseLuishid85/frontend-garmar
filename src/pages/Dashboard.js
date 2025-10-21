// src/pages/Dashboard.js
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import '../index.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <h1 className="header">Bienvenido, {user?.nombres || 'Usuario'}!</h1>
      <p>Usa el menú para gestionar empresas, deudas y pagos.</p>
    </div>
  );
};

export default Dashboard;