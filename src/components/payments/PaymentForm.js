// src/components/payments/PaymentForm.js
import { useState } from 'react';
import api from '../../services/api';
import '../../index.css';

const PaymentForm = ({ debtId, onSuccess, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/payments', {
        debtId: parseInt(debtId),
        amount: parseFloat(amount),
        notes
      });
      onSuccess();
    } catch (err) {
      setError('Error al registrar el pago. Verifica el monto.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        step="0.01"
        placeholder="Monto del pago"
        className="input"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <textarea
        placeholder="Notas (opcional)"
        className="input"
        style={{ height: '80px', resize: 'vertical' }}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      {error && <div className="text-error">{error}</div>}
      <button
        type="submit"
        className="btn btn-success"
        disabled={loading}
      >
        {loading ? 'Guardando...' : 'Registrar Pago'}
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onCancel}
        disabled={loading}
      >
        Cancelar
      </button>
    </form>
  );
};

export default PaymentForm;