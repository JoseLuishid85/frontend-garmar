// src/pages/DebtsPage.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DebtForm from '../components/debts/DebtForm';
import '../index.css';

const DebtsPage = () => {
  const [debts, setDebts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchDebts = async () => {
    setLoading(true);
    try {
      const [debtsRes, companiesRes] = await Promise.all([
        api.get('/debts/company/all'),
        api.get('/companies')
      ]);
      setDebts(debtsRes.data);
      console.log(debtsRes.data);
      setCompanies(companiesRes.data);
    } catch (err) {
      alert('Error al cargar datos');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Desconocida';
  };

  const totalAmountSum = debts.reduce((sum, debt) => sum + parseFloat(debt.summary.balance || 0), 0);

  return (
    <div className="container" style={{ paddingTop: '5px', paddingBottom: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
        {
        <button
          className="btn btn-success"
          onClick={() => setShowForm(true)}
        >
          + Agregar deuda
        </button>
        }

        <h2 className="header">Lista de Deudas</h2>

      </div>

      {loading && <div className="loading">Cargando...</div>}

      {showForm ? (
        <div className="card">
          <DebtForm
            companies={companies}
            onSave={fetchDebts}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}> {/* Contenedor para manejar tablas anchas en móviles */}
          {debts.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>No hay deudas registradas.</p>
          ) : (
            
            <table style={{
              width: '100%',
              borderCollapse: 'collapse', // Asegura bordes limpios
              marginBottom: '20px',
              boxShadow: '0 2px 3px rgba(0,0,0,0.1)' // Sombra ligera para destacar
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f4f4f4' }}> {/* Fondo para la cabecera */}
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Descripción</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Empresa</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>Monto</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>Pagado</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>Debe</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                
                {debts.map((debt, index) => (
                  <tr
                    key={debt.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    
                    <td style={{ padding: '10px', border: '1px solid #eee' }}>{debt.description || 'Factura sin descripción'}</td>  
                    <td style={{ padding: '10px', border: '1px solid #eee' }}>{debt.company.name}</td>
                    <td style={{ padding: '10px', border: '1px solid #eee', textAlign: 'right' }}>
                      {parseFloat(debt.totalAmount).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #eee', textAlign: 'right' }}>
                      {parseFloat(debt.summary.totalPaid).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #eee', textAlign: 'right' }}>
                      {parseFloat(debt.summary.balance).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #eee' }}>
                      <button
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#007bff', 
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        onClick={() => navigate(`/debts/company/${debt.company.id}/summary`)}
                      >
                        Pagar
                      </button>
                    </td>
                  </tr>
                ))}

                <tr style={{
                  backgroundColor: '#e6f7ff', 
                  borderTop: '3px solid #007bff' 
                }}>
                  <td colSpan="4" style={{ fontWeight: 'bold', padding: '10px', border: '1px solid #eee' }}>Total General</td>
                  <td style={{ fontWeight: 'bolder', textAlign: 'right', padding: '10px', border: '1px solid #eee', color: '#0056b3' }}>
                    
                    {totalAmountSum.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #eee' }}></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default DebtsPage;