// src/pages/ReportDayListPage.js
import { useState, useEffect } from 'react';
import api from '../services/api';
import '../index.css'; // Usando tus estilos existentes

const getCurrentYearMonth = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}`;
};


const ReportDayListPage = () => {
    const [selectedMonthYear, setSelectedMonthYear] = useState(getCurrentYearMonth());
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [totalMonthlyDollar, setTotalMonthlyDollar] = useState('0.00');

    const calculateTotal = (data) => {
        let total = 0;
        data.forEach(report => {
            const dailyTotal = parseFloat(report.totalDollar) || 0;
            total += dailyTotal;
        });
        setTotalMonthlyDollar(total.toFixed(2));
    };

    const fetchMonthlyReports = async () => {
        setLoading(true);
        setError('');
        setReports([]);
        setTotalMonthlyDollar('0.00');

        // Extraer año y mes del formato YYYY-MM
        const [year, month] = selectedMonthYear.split('-');

        if (!year || !month) {
            setError('Selecciona un mes y un año válidos.');
            setLoading(false);
            return;
        }

        try {
            // Llamada al endpoint perfecto que creaste
            const res = await api.get(`/reportday/monthly?year=${year}&month=${month}`);
            setReports(res.data);
            calculateTotal(res.data);

        } catch (err) {
            console.error(err);
            // Manejar 404 de "No hay reportes"
            if (err.response && err.response.status === 404) {
                setError(`No hay reportes para ${month}/${year}.`);
            } else {
                setError('Error al cargar los reportes mensuales.');
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMonthlyReports();
    }, []); 


    return (
        <div className="container" style={{ paddingTop: '20px', paddingBottom: '80px' }}>
            <h2 className="header">📋 Reporte Mensual de Entradas</h2>

            {/* --- Selector de Mes/Año --- */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #e5e7eb', paddingBottom: '15px' }}>

                <input
                    type="month"
                    className="input"
                    value={selectedMonthYear}
                    onChange={(e) => setSelectedMonthYear(e.target.value)}
                    style={{ flexGrow: 1, maxWidth: '200px', fontSize: '16px' }}
                />

                <button
                    className="btn btn-primary"
                    onClick={fetchMonthlyReports}
                    disabled={loading}
                    style={{ padding: '10px 20px' }}
                >
                    {loading ? 'Buscando...' : 'Buscar Reporte'}
                </button>
            </div>

            {/* --- Mensajes de Estado --- */}
            {loading && <div className="loading">Cargando reportes...</div>}
            {error && <div className="text-error" style={{ textAlign: 'center' }}>{error}</div>}

            {/* --- Total Mensual --- */}
            {reports.length > 0 && (
                <div style={{ padding: '15px', backgroundColor: '#d1fae5', borderRadius: '8px', border: '1px solid #10b981', textAlign: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#065f46' }}>
                        Total de Entradas del Mes:
                    </h3>
                    <span style={{ fontWeight: 'bold', fontSize: '28px', color: '#065f46', display: 'block', marginTop: '5px' }}>
                        $ {totalMonthlyDollar}
                    </span>
                </div>
            )}

            <div style={{ display: 'grid', gap: '15px' }}>
                {reports.map((report) => (
                    <div key={report.id} className="card" style={{ padding: '15px', borderLeft: '5px solid #3b82f6' }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>

                            <h4 style={{ margin: 0, color: '#3b82f6', display: 'flex', flexDirection: 'column' }}>
                                📅 {report.day}
                            </h4>

                            <div style={{ textAlign: 'right' }}>

                                {/* Tasa del Día (span en línea) */}
                                <span style={{ fontWeight: 'normal', color: '#6b7280', fontSize: '14px', display: 'block' }}>
                                    Tasa: Bs {report.dollarPrice}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                                    Efectivo:{report.cash || 0} ({report.cashDollar} ) | $: {report.dollar || 0} </p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                                    Punto Venta: {report.pointSale || 0} ({report.pointSaleDollar} ) | Pago Móvil: {report.paymentMobil || 0} ({report.paymentMobilDollar} )
                                </p>
                            </div>

                            <span
                                style={{
                                    margin: '0',
                                    fontSize: '22px',
                                    fontWeight: 'bold',
                                    color: '#1e293b',
                                    // El display: block hace que vaya a una nueva línea sin el margen extra de <p>
                                    display: 'block',
                                    // Reducimos el marginTop para pegarlo más a la Tasa
                                    marginTop: '2px'
                                }}
                            >
                                $ {report.totalDollar}
                            </span>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
};

export default ReportDayListPage;