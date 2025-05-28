import React from 'react';

const TransactionsList = () => {
    // Generar facturas con fechas aleatorias 
    const invoices = Array.from({ length: 7 }, (_, i) => ({
        id: i + 1,
        // Fecha aleatoria en los últimos 30 días
        date: new Date(
            Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
        ).toLocaleDateString('es-ES')
    }));

    return (
        <div className='p-6 bg-gray-50 rounded-lg shadow-md'>
            <ul className='space-y-3'>
                {invoices.map(inv => (
                    <li
                        className='flex items-center justify-between bg-white p-4 rounded-lg shadow-sm'
                    >
                        <span>Factura {inv.id} guardada</span>
                        <span className='text-gray-500'>{inv.date}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TransactionsList;
