// src/components/companies/CompanyForm.js
import { useState } from 'react';
import api from '../../services/api';
import '../../index.css';

const CompanyForm = ({ company, onSave, onCancel }) => {
  const [name, setName] = useState(company?.name || '');
  const [contactName, setContactName] = useState(company?.contactName || '');
  const [email, setEmail] = useState(company?.email || '');
  const [phone, setPhone] = useState(company?.phone || '');
  const [type, setType] = useState(company?.type || 'supplier');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (company) {
        await api.put(`/companies/${company.id}`, {
          name, contactName, email, phone, type
        });
      } else {
        await api.post('/companies', {
          name, contactName, email, phone, type
        });
        
        setName('');
        setContactName('');
        setEmail('');
        setPhone('');
        setType('supplier');
      }
      setLoading(false);
      onSave();
    } catch (err) {
      setError('Error al guardar la empresa. Verifica los datos.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre de la empresa *"
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Nombre de contacto"
        className="input"
        value={contactName}
        onChange={(e) => setContactName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Teléfono"
        className="input"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <select
        className="input"
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ fontSize: '16px' }}
      >
        <option value="supplier">Proveedor</option>
        <option value="client">Cliente</option>
      </select>
      {error && <div className="text-error">{error}</div>}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? 'Guardando...' : company ? 'Actualizar' : 'Crear'}
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

export default CompanyForm;