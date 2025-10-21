// src/pages/CompaniesPage.js
import { useState, useEffect } from 'react';
import api from '../services/api';
import CompanyForm from '../components/companies/CompanyForm';
import '../index.css';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await api.get('/companies');
      setCompanies(res.data);
    } catch (err) {
      alert('Error al cargar empresas');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '20px', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
        <button
          className="btn btn-success"
          onClick={() => {
            setEditingCompany(null);
            setShowForm(true);
          }}
        >
          + Nueva
        </button>

        <h2 className="header">Empresas</h2>
      </div>

      {loading && <div className="loading">Cargando...</div>}

      {showForm ? (
        <div className="card">
          <CompanyForm
            company={editingCompany}
            onSave={fetchCompanies}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <div>
          {companies.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>No hay empresas registradas.</p>
          ) : (
            companies.map(company => (
              <div key={company.id} className="card">
                <h3>{company.name}</h3>
                <p>Tipo: {company.type === 'supplier' ? 'Proveedor' : 'Cliente'}</p>
                {company.contactName && <p>Contacto: {company.contactName}</p>}
                {company.email && <p>Email: {company.email}</p>}
                <button
                  className="btn btn-secondary"
                  style={{ marginTop: '10px' }}
                  onClick={() => {
                    setEditingCompany(company);
                    setShowForm(true);
                  }}
                >
                  Editar
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;