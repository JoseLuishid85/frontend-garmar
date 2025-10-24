// src/components/reports/ReportDayForm.js
import { useEffect, useState } from 'react';
import api from '../../services/api';
import '../../index.css';

const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-CA');
};

const calculateDollarEquivalent = (bsValue, dollarPrice) => {
    const tasa = parseFloat(dollarPrice);
    const bolivares = parseFloat(bsValue);

    if (tasa > 0 && !isNaN(bolivares) && bolivares >= 0) {
        return (bolivares / tasa).toFixed(2);
    }
    return ''; // Devuelve cadena vacía si no es válido
};


const ReportDayForm = ({ onSave, onCancel }) => {
    const [dollarPrice, setDollarPrice] = useState('');
    const [cash, setCash] = useState('');
    const [cashDollar, setCashDollar] = useState('');
    const [dollar, setDollar] = useState('');
    const [pointSale, setPointSale] = useState('');
    const [pointSaleDollar, setPointSaleDollar] = useState('');
    const [paymentMobil, setPaymentMobil] = useState('');
    const [paymentMobilDollar, setPaymentMobilDollar] = useState('');
    const [totalDollar, setTotalDollar] = useState('0.00');
    const [day, setDay] = useState(getTodayDate());

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setCashDollar(calculateDollarEquivalent(cash, dollarPrice));
        setPointSaleDollar(calculateDollarEquivalent(pointSale, dollarPrice));
        setPaymentMobilDollar(calculateDollarEquivalent(paymentMobil, dollarPrice));
    }, [dollarPrice, cash, pointSale, paymentMobil]);


    useEffect(() => {
        const d_manual = parseFloat(dollar) || 0;
        const d_cash = parseFloat(cashDollar) || 0;
        const d_point = parseFloat(pointSaleDollar) || 0;
        const d_mobil = parseFloat(paymentMobilDollar) || 0;

        const total = d_manual + d_cash + d_point + d_mobil;

        setTotalDollar(total.toFixed(2));
    }, [dollar, cashDollar, pointSaleDollar, paymentMobilDollar]);

    const handleBsChange = (value, setStateBs, setStateDollar) => {
        setStateBs(value);

        const resultDollar = calculateDollarEquivalent(value, dollarPrice);
        setStateDollar(resultDollar);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validación básica
        if (!dollarPrice || !day) {
            setError('El Precio del Dólar y el Día son obligatorios.');
            setLoading(false);
            return;
        }

        try {
            // Lógica para CREAR el reporte (POST)
            await api.post('/reportday', { // Asume que la ruta POST es /reports
                dollarPrice,
                cash,
                cashDollar,
                dollar,
                pointSale,
                pointSaleDollar,
                paymentMobil,
                paymentMobilDollar,
                day,
                totalDollar
            });

            // 💡 Limpiar estados después de guardar exitosamente (opcional)
            setDollarPrice('');
            setCash('');
            setDollar('');
            setPointSale('');
            setPaymentMobil('');
            setDay(getTodayDate()); // Restaurar a la fecha de hoy

            setLoading(false);
            onSave(); // Llama a la función de éxito que redirige

        } catch (err) {
            console.error(err);
            // Mensaje de error si falla la API
            setError('Error al crear el reporte. Asegúrate de que no exista un reporte para esta fecha.');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            {/* Campo: Día (Date Input) */}
            <label className="label-form">Día del Reporte *</label>
            <input
                type="date"
                className="input"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                required
            />



            <label className="label-form">Precio del Dólar (Tasa) *</label>
            <input 
                type="number" 
                step="0.01" 
                placeholder="Precio del Dólar (ej: 38.50)" 
                className="input" value={dollarPrice}
                onChange={(e) => setDollarPrice(e.target.value)} 
                required
            />

            <label className="label-form">Monto en Dólares (Efectivo)</label>
            <input
                type="number"
                step="0.01"
                placeholder="Efectivo $"
                className="input"
                value={dollar}
                onChange={(e) => setDollar(e.target.value)}
            />

            <label className="label-form">Monto en Efectivo (Bolívares)</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Efectivo Bs"
                        className="input"
                        value={cash}
                        onChange={(e) => handleBsChange(e.target.value, setCash, setCashDollar)}
                    />
                </div>

                <div style={{ flex: 1 }}>
                    <input
                        type="number"
                        step="0.01"
                        className="input"
                        value={cashDollar}
                        readOnly // 🔒 
                        disabled={true}
                        style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                    />
                </div>
            </div>



            <label className="label-form">Monto Punto de Venta</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Punto de Venta"
                        className="input"
                        value={pointSale}
                        onChange={(e) => handleBsChange(e.target.value, setPointSale, setPointSaleDollar)}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <input
                        type="number"
                        step="0.01"
                        className="input"
                        value={pointSaleDollar}
                        readOnly // 🔒 
                        disabled={true}
                        style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                    />
                </div>
            </div>


            <label className="label-form">Monto Pago Móvil/Transferencia</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Pago Móvil/Transferencia"
                        className="input"
                        value={paymentMobil}
                        onChange={(e) => handleBsChange(e.target.value, setPaymentMobil, setPaymentMobilDollar)}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <input
                        type="number"
                        step="0.01"
                        className="input"
                        value={paymentMobilDollar}
                        readOnly // 🔒 
                        disabled={true}
                        style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                    />
                </div>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#1f2937' }}>
                    Total en Dólares:
                    <span style={{ fontWeight: 'bold', marginLeft: '10px', color: '#10b981' }}>
                        $ {totalDollar}
                    </span>
                </h3>
            </div>

            {error && <div className="text-error">{error}</div>}

            <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ marginTop: '20px' }}
            >
                {loading ? 'Creando Reporte...' : 'Crear Reporte'}
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

export default ReportDayForm;