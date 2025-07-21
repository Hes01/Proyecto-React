import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ReporteCompras = () => {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [reporte, setReporte] = useState([]);

  const fetchReporte = async () => {
    if (!desde || !hasta) {
      alert('Seleccione el rango de fechas');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/reporte/compras?desde=${desde}&hasta=${hasta}`);
      setReporte(res.data);
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Error al generar el reporte');
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Compras', 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [['N° Pedido', 'Proveedor', 'Fecha', 'Subtotal', 'Impuesto', 'Total']],
      body: reporte.map(r => [
        r.numero,
        r.proveedor,
        new Date(r.fecha).toLocaleDateString(),
        parseFloat(r.subtotal).toFixed(2),
        parseFloat(r.impuesto).toFixed(2),
        parseFloat(r.total).toFixed(2),
      ])
    });

    doc.save('reporte_compras.pdf');
  };

  const exportarExcel = () => {
    const data = reporte.map(r => ({
      'N° Pedido': r.numero,
      'Proveedor': r.proveedor,
      'Fecha': new Date(r.fecha).toLocaleDateString(),
      'Subtotal': parseFloat(r.subtotal).toFixed(2),
      'Impuesto': parseFloat(r.impuesto).toFixed(2),
      'Total': parseFloat(r.total).toFixed(2),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Compras');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'reporte_compras.xlsx');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Reporte de Compras por Rango de Fechas</h2>
      <label>
        Desde: <input type="date" value={desde} onChange={e => setDesde(e.target.value)} />
      </label>
      <label style={{ marginLeft: '1rem' }}>
        Hasta: <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} />
      </label>
      <button onClick={fetchReporte} style={{ marginLeft: '1rem' }}>Generar Reporte</button>

      {reporte.length > 0 && (
        <>
          <table border="1" cellPadding="5" cellSpacing="0" style={{ marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>N° Pedido</th>
                <th>Proveedor</th>
                <th>Fecha</th>
                <th>Subtotal</th>
                <th>Impuesto</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {reporte.map((r) => (
                <tr key={r.numero}>
                  <td>{r.numero}</td>
                  <td>{r.proveedor}</td>
                  <td>{new Date(r.fecha).toLocaleDateString()}</td>
                  <td>{parseFloat(r.subtotal).toFixed(2)}</td>
                  <td>{parseFloat(r.impuesto).toFixed(2)}</td>
                  <td>{parseFloat(r.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1rem' }}>
            <button onClick={exportarPDF}>Descargar PDF</button>
            <button onClick={exportarExcel} style={{ marginLeft: '1rem' }}>Descargar Excel</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReporteCompras;
