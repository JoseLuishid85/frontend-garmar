// src/components/layout/Navbar.js
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { SidebarContext } from '../../contexts/SidebarContext';
import '../../index.css';

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const { openSidebar } = useContext(SidebarContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '16px',
      position: 'sticky',
      top: 0,
      zIndex: 101,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      {/* Botón de menú (solo en móvil, pero lo dejamos siempre) */}
      <button
        onClick={openSidebar}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer'
        }}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Control Pago Garmar</span>

      <button
        onClick={handleLogout}
        style={{
          background: 'none',
          border: '1px solid white',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '14px'
        }}
      >
        Salir
      </button>
    </nav>
  );
};

export default Navbar;