import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ReporteInventario = () => {
  const [inventario, setInventario] = useState([]);

  const fetchInventario = async () => {
    try {
      const res = await axios.get('http://localhost:5000/reporte/inventario');
      setInventario(res.data);
    } catch (error) {
      console.error('Error al obtener inventario:', error);
      alert('Hubo un error al generar el reporte');
    }
  };

  useEffect(() => {
    fetchInventario();
  }, []);

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Inventario Actual', 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [['ID', 'Descripción', 'Línea', 'Unidad', 'Stock', 'Costo', 'Venta', 'Descuento']],
      body: inventario.map((a) => [
        a.idarticulo,
        a.descripcion,
        a.linea,
        a.unidad,
        a.stock,
        parseFloat(a.preciocosto).toFixed(2),
        parseFloat(a.precioventa).toFixed(2),
        parseFloat(a.descuento).toFixed(2),
      ]),
    });

    doc.save('inventario_actual.pdf');
  };

  const exportarExcel = () => {
    const data = inventario.map((a) => ({
      ID: a.idarticulo,
      Descripción: a.descripcion,
      Línea: a.linea,
      Unidad: a.unidad,
      Stock: a.stock,
      'Precio Costo': parseFloat(a.preciocosto).toFixed(2),
      'Precio Venta': parseFloat(a.precioventa).toFixed(2),
      Descuento: parseFloat(a.descuento).toFixed(2),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'inventario_actual.xlsx');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Reporte de Inventario Actual</h2>

      {inventario.length > 0 && (
        <>
          <table border="1" cellPadding="5" cellSpacing="0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Línea</th>
                <th>Unidad</th>
                <th>Stock</th>
                <th>Precio Costo</th>
                <th>Precio Venta</th>
                <th>Descuento</th>
              </tr>
            </thead>
            <tbody>
              {inventario.map((a) => (
                <tr key={a.idarticulo}>
                  <td>{a.idarticulo}</td>
                  <td>{a.descripcion}</td>
                  <td>{a.linea}</td>
                  <td>{a.unidad}</td>
                  <td>{a.stock}</td>
                  <td>{parseFloat(a.preciocosto).toFixed(2)}</td>
                  <td>{parseFloat(a.precioventa).toFixed(2)}</td>
                  <td>{parseFloat(a.descuento).toFixed(2)}</td>
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

export default ReporteInventario;
