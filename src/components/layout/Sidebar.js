// src/components/layout/Sidebar.js
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SidebarContext } from '../../contexts/SidebarContext';
import '../../index.css';

const Sidebar = () => {
  const { isOpen, closeSidebar } = useContext(SidebarContext);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay oscuro */}
      <div
        onClick={closeSidebar}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 99,
        }}
      ></div>

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '280px',
          backgroundColor: 'white',
          zIndex: 100,
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>
            Debt Control
          </h2>
        </div>

        <nav style={{ padding: '16px' }}>
          <Link
            to="/dashboard"
            onClick={closeSidebar}
            style={{
              display: 'block',
              padding: '14px 16px',
              textDecoration: 'none',
              color: '#1e293b',
              borderRadius: '8px',
              marginBottom: '8px',
              fontSize: '16px'
            }}
            className="sidebar-link"
          >
            🏠 Inicio
          </Link>
          <Link
            to="/companies"
            onClick={closeSidebar}
            style={{
              display: 'block',
              padding: '14px 16px',
              textDecoration: 'none',
              color: '#1e293b',
              borderRadius: '8px',
              marginBottom: '8px',
              fontSize: '16px'
            }}
          >
            🏢 Empresas
          </Link>
          <Link
            to="/debts"
            onClick={closeSidebar}
            style={{
              display: 'block',
              padding: '14px 16px',
              textDecoration: 'none',
              color: '#1e293b',
              borderRadius: '8px',
              marginBottom: '8px',
              fontSize: '16px'
            }}
          >
            📄 Deudas
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;