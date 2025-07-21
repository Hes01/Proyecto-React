import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ReporteStockBajo = () => {
  const [stockBajo, setStockBajo] = useState([]);

  const fetchStockBajo = async () => {
    try {
      const res = await axios.get('http://localhost:5000/reporte/stock-bajo');
      setStockBajo(res.data);
    } catch (error) {
      console.error('Error al obtener artículos con stock bajo:', error);
      alert('Error al generar el reporte');
    }
  };

  useEffect(() => {
    fetchStockBajo();
  }, []);

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Artículos con Stock Bajo', 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [['ID', 'Descripción', 'Línea', 'Unidad', 'Stock']],
      body: stockBajo.map((a) => [
        a.idarticulo,
        a.descripcion,
        a.linea,
        a.unidad,
        a.stock,
      ]),
    });

    doc.save('stock_bajo.pdf');
  };

  const exportarExcel = () => {
    const data = stockBajo.map((a) => ({
      ID: a.idarticulo,
      Descripción: a.descripcion,
      Línea: a.linea,
      Unidad: a.unidad,
      Stock: a.stock,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'StockBajo');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'stock_bajo.xlsx');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Reporte de Artículos con Stock Bajo</h2>

      {stockBajo.length > 0 && (
        <>
          <table border="1" cellPadding="5" cellSpacing="0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Línea</th>
                <th>Unidad</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {stockBajo.map((a) => (
                <tr key={a.idarticulo}>
                  <td>{a.idarticulo}</td>
                  <td>{a.descripcion}</td>
                  <td>{a.linea}</td>
                  <td>{a.unidad}</td>
                  <td>{a.stock}</td>
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

export default ReporteStockBajo;
