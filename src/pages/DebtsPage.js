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
  const totalBalanceSum = debts.reduce((sum, debt) => sum + debt.summary.balance, 0);

  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };



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
        <div className="app-container">
          <h1 className="header-title">
            Lista de Deudas
          </h1>

          {debts.length === 0 ? (
            <div className="p-6 bg-white rounded-xl shadow-md text-center text-gray-500 max-w-xl mx-auto">
              No hay deudas registradas.
            </div>
          ) : (
            <div className="max-width-container">

              {/* Resumen Total General */}
              <div className="summary-card">
                <div>
                  <p className="summary-text-sm">Total Pendiente a Pagar</p>
                  <h2 className="summary-balance">
                    {formatCurrency(totalAmountSum)}
                  </h2>
                </div>
                <span className="summary-badge">
                  {debts.length} Deudas Activas
                </span>
              </div>

              {/* Lista de Deudas (Vista de Tarjeta Única para todos los dispositivos) */}
              <div className="debt-list">
                {debts.map((debt) => {
                  const isPaid = debt.summary.balance <= 0;
                  const balanceColorClass = isPaid ? 'text-paid' : 'text-pending';
                  const borderColorClass = isPaid ? 'border-paid' : 'border-pending';

                  return (
                    <div
                      key={debt.id}
                      className={`debt-card ${borderColorClass}`}
                    >
                      {/* CABECERA - DESCRIPCIÓN Y BALANCE (LO MÁS IMPORTANTE) */}
                      <div className="card-header">
                        <div className="header-details">
                          <p className="company-name">
                            {debt.description || 'Factura sin descripción'}
                          </p>
                          <h2 className="debt-description">
                            {debt.company.name}
                          </h2>
                        </div>

                        {/* BALANCE A PAGAR - Destacado */}
                        <div className="balance-section">
                          <p className="balance-label">
                            {isPaid ? 'Pagado' : 'Pendiente'}
                          </p>
                          <span className={`balance-value ${balanceColorClass}`}>
                            {formatCurrency(debt.summary.balance)}
                          </span>
                        </div>
                      </div>

                      {/* CUERPO - DETALLES DE MONTO Y PAGADO */}
                      <div className="detail-grid">

                        {/* Monto Total */}
                        <div className="detail-label">Monto Total:</div>
                        <div className="detail-value">
                          {formatCurrency(debt.totalAmount)}
                        </div>

                        {/* Monto Pagado - Destacado */}
                        <div className="detail-label">Monto Pagado:</div>
                        <div className="detail-value paid-value">
                          {formatCurrency(debt.summary.totalPaid)}
                        </div>
                      </div>

                      {/* ACCIÓN */}
                      <div className="action-section">
                        {!isPaid && (
                          <button
                            className="pay-button"
                            onClick={() => navigate(`/debts/company/${debt.company.id}/summary`)}
                          >
                            Pagar Ahora
                          </button>
                        )}
                        {isPaid && (
                          <span className="paid-status-tag">
                            Deuda Saldada
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );


};

export default DebtsPage;