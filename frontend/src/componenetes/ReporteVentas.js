/*
import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ReporteVentas = () => {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [reporte, setReporte] = useState([]);

  const obtenerReporte = async () => {
    if (!desde || !hasta) {
      alert('Debes seleccionar ambas fechas');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/reporte/ventas?desde=${desde}&hasta=${hasta}`);
      setReporte(res.data);
    } catch (error) {
      console.error('Error al obtener el reporte:', error);
      alert('Hubo un error al generar el reporte');
    }
  };

  const exportarExcel = () => {
    if (reporte.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(reporte);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');

    const fechaHoy = new Date().toISOString().split('T')[0];
    const nombreArchivo = `Reporte_Ventas_${fechaHoy}.xlsx`;

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Reporte de Ventas por Rango de Fechas</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>Desde: </label>
        <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        <label style={{ marginLeft: '1rem' }}>Hasta: </label>
        <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        <button onClick={obtenerReporte} style={{ marginLeft: '1rem' }}>Generar Reporte</button>
        <button onClick={exportarExcel} style={{ marginLeft: '1rem' }}>📥 Exportar a Excel</button>
      </div>

      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Número</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>SubTotal</th>
            <th>Impuesto</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {reporte.map((r) => (
            <tr key={r.numero}>
              <td>{r.numero}</td>
              <td>{r.cliente}</td>
              <td>{new Date(r.fecha).toLocaleDateString()}</td>
              <td>{r.subtotal.toFixed(2)}</td>
              <td>{r.impuesto.toFixed(2)}</td>
              <td>{r.total.toFixed(2)}</td>
            </tr>
          ))}
          {reporte.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No hay datos para mostrar</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReporteVentas;

*/


import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ReporteVentas = () => {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [reporte, setReporte] = useState([]);

  const fetchReporte = async () => {
    if (!desde || !hasta) {
      alert('Seleccione el rango de fechas');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/reporte/ventas?desde=${desde}&hasta=${hasta}`);
      setReporte(res.data);
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Hubo un error al generar el reporte');
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Ventas', 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [['N° Pedido', 'Cliente', 'Fecha', 'Subtotal', 'Impuesto', 'Total']],
      body: reporte.map((r) => [
        r.numero,
        r.cliente,
        new Date(r.fecha).toLocaleDateString(),
        parseFloat(r.subtotal).toFixed(2),
        parseFloat(r.impuesto).toFixed(2),
        parseFloat(r.total).toFixed(2),
      ]),
    });

    doc.save('reporte_ventas.pdf');
  };

  const exportarExcel = () => {
    const data = reporte.map((r) => ({
      'N° Pedido': r.numero,
      'Cliente': r.cliente,
      'Fecha': new Date(r.fecha).toLocaleDateString(),
      'Subtotal': parseFloat(r.subtotal).toFixed(2),
      'Impuesto': parseFloat(r.impuesto).toFixed(2),
      'Total': parseFloat(r.total).toFixed(2),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'reporte_ventas.xlsx');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Reporte de Ventas por Rango de Fechas</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Desde: <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </label>
        <label style={{ marginLeft: '1rem' }}>
          Hasta: <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </label>
        <button onClick={fetchReporte} style={{ marginLeft: '1rem' }}>Generar Reporte</button>
      </div>

      {reporte.length > 0 && (
        <>
          <table border="1" cellPadding="5" cellSpacing="0">
            <thead>
              <tr>
                <th>N° Pedido</th>
                <th>Cliente</th>
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
                  <td>{r.cliente}</td>
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
            <button onClick={exportarExcel} style={{ marginLeft: '10px' }}>Descargar Excel</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReporteVentas;
