// src/pages/DebtSummaryPage.js
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import PaymentForm from '../components/payments/PaymentForm';
import '../index.css';

const DebtSummaryPage = () => {
  const { companyId } = useParams();
  const [summary, setSummary] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedDebtId, setSelectedDebtId] = useState(null);

  const fetchSummary = async () => {
    try {
      const res = await api.get(`/debts/company/${companyId}/summary`);
      setSummary(res.data);
    } catch (err) {
      alert('Error al cargar el resumen');
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [companyId]);

  if (!summary) {
    return <div className="loading">Cargando deudas...</div>;
  }

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <h2 className="header">Deudas de: {summary.company.name}</h2>

      <div className="card" style={{ backgroundColor: '#f0f9ff', borderLeft: '4px solid #3b82f6' }}>
        <p><strong>Total adeudado:</strong> ${summary.summary.totalDebt}</p>
        <p><strong>Total pagado:</strong> ${summary.summary.totalPaid}</p>
        <p><strong>Saldo pendiente:</strong> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
          ${summary.summary.balance}
        </span></p>
      </div>

      {showPaymentForm && (
        <div className="card">
          <h3>Registrar Pago</h3>
          <PaymentForm
            debtId={selectedDebtId}
            onSuccess={() => {
              setShowPaymentForm(false);
              fetchSummary();
            }}
            onCancel={() => setShowPaymentForm(false)}
          />
        </div>
      )}

      <h3 className="header" style={{ fontSize: '18px' }}>Facturas pendientes</h3>
      {summary.debts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '20px' }}>
          No hay deudas pendientes.
        </p>
      ) : (
        summary.debts.map(debt => (
          <div key={debt.id} className="card">
            <p><strong>{debt.description || 'Factura sin descripción'}</strong></p>
            <p>Monto: ${debt.totalAmount}</p>
            <p>Estado: {debt.status}</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '10px' }}
              onClick={() => {
                setSelectedDebtId(debt.id);
                setShowPaymentForm(true);
              }}
            >
              Registrar Pago
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default DebtSummaryPage;