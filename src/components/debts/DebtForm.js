// src/components/debts/DebtForm.js
import { useState } from 'react';
import api from '../../services/api';
import '../../index.css';

const DebtForm = ({ companies, onSave, onCancel }) => {
  const [companyId, setCompanyId] = useState('');
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyId) {
      setError('Selecciona una empresa');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await api.post('/debts', {
        companyId: parseInt(companyId),
        description,
        totalAmount: parseFloat(totalAmount),
        dueDate: dueDate || null
      });
      onSave();
    } catch (err) {
      setError('Error al crear la deuda');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        className="input"
        value={companyId}
        onChange={(e) => setCompanyId(e.target.value)}
        required
        style={{ fontSize: '16px' }}
      >
        <option value="">Selecciona una empresa *</option>
        {companies.map(company => (
          <option key={company.id} value={company.id}>
            {company.name} ({company.type === 'supplier' ? 'Proveedor' : 'Cliente'})
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Descripción (ej. Factura #123)"
        className="input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        placeholder="Monto total *"
        className="input"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
        required
      />
      <input
        type="date"
        className="input"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      {error && <div className="text-error">{error}</div>}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? 'Guardando...' : 'Crear Deuda'}
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

export default DebtForm;