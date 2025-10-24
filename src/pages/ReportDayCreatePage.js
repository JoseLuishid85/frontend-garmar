// src/pages/ReportDayCreatePage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegar tras el éxito
import ReportDayForm from '../components/reports/ReportDayForm'; // Lo crearás después
import '../index.css';

const ReportDayCreatePage = () => {
    const navigate = useNavigate();
    
    const handleSave = () => {
        navigate('/dashboard'); 
    };

    const handleCancel = () => {
        // Redirigir al usuario si cancela la operación
        navigate('/dashboard'); 
    };

    return (
        <div className="container" style={{ paddingTop: '20px', paddingBottom: '80px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
                <h2 className="header">📈 Crear Reporte Diario</h2>
            </div>
            
            <div className="card">
                <ReportDayForm
                    onSave={handleSave}   // Le pasa la función de redirección al guardar
                    onCancel={handleCancel} // Le pasa la función de redirección al cancelar
                />
            </div>
            
        </div>
    );
};

export default ReportDayCreatePage;