import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../componenetes/css/articulos.css";

const ArticulosCRUD = () => {
  const [articulos, setArticulos] = useState([]);
  const [form, setForm] = useState({
    descripcion: '',
    idlinea: '',
    unidad: '',
    stock: '',
    preciocosto: '',
    precioventa: '',
    descuento: ''
  });
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    fetchArticulos();
  }, []);

  const fetchArticulos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/articulo');
      setArticulos(res.data);
    } catch (error) {
      console.error('Error al cargar artículos:', error);
    }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.descripcion || !form.unidad || !form.idlinea.trim()) {
      return alert('Completa descripción, unidad y selecciona línea válida.');
    }

    try {
      if (editando) {
        await axios.put(`http://localhost:5000/articulo/${form.idarticulo}`, form);
      } else {
        await axios.post('http://localhost:5000/articulo', form);
      }
      setForm({
        descripcion: '', idlinea: '', unidad: '',
        stock: '', preciocosto: '', precioventa: '', descuento: ''
      });
      setEditando(false);
      fetchArticulos();
    } catch (error) {
      console.error('Error al guardar artículo:', error);
      alert(error.response?.data?.error || 'Error al guardar.');
    }
  };

  const handleDelete = async idarticulo => {
    if (window.confirm('¿Eliminar este artículo?')) {
      await axios.delete(`http://localhost:5000/articulo/${idarticulo}`);
      fetchArticulos();
    }
  };

  const handleEdit = art => {
    setForm(art);
    setEditando(true);
  };

  return (
    <div className="articulos-container">
      <h2>Gestión de Artículos</h2>
      <form onSubmit={handleSubmit} className="articulos-form">
        {editando && <input name="idarticulo" value={form.idarticulo} disabled />}
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required />
        <input name="unidad" placeholder="Unidad" value={form.unidad} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <input name="preciocosto" type="number" placeholder="Precio Costo" value={form.preciocosto} onChange={handleChange} required />
        <input name="precioventa" type="number" placeholder="Precio Venta" value={form.precioventa} onChange={handleChange} required />
        <input name="descuento" type="number" placeholder="Descuento" value={form.descuento} onChange={handleChange} required />

        <select name="idlinea" value={form.idlinea} onChange={handleChange} required>
          <option value="">-- Seleccione línea --</option>
          <option value="ELE">Electrodomésticos</option>
          <option value="AUD">Audio</option>
          <option value="VID">Video</option>
          <option value="COM">Computadoras</option>
          <option value="BLA">Línea Blanca</option>
        </select>

        <button type="submit">{editando ? 'Actualizar' : 'Agregar'}</button>
        {editando && <button onClick={() => { setForm({ descripcion:'',idlinea:'',unidad:'',stock:'',preciocosto:'',precioventa:'',descuento:'' }); setEditando(false); }}>Cancelar</button>}
      </form>

      <table className="articulos-table">
        <thead>
          <tr><th>ID</th><th>Descripción</th><th>Línea</th><th>Unidad</th><th>Stock</th><th>Costo</th><th>Venta</th><th>Descuento</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {articulos.map(a => (
            <tr key={a.idarticulo}>
              <td>{a.idarticulo}</td>
              <td>{a.descripcion}</td>
              <td>{a.idlinea}</td>
              <td>{a.unidad}</td>
              <td>{a.stock}</td>
              <td>{a.preciocosto}</td>
              <td>{a.precioventa}</td>
              <td>{a.descuento}</td>
              <td>
                <button onClick={() => handleEdit(a)}>Editar</button>
                <button onClick={() => handleDelete(a.idarticulo)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticulosCRUD;


/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ArticulosCRUD = () => {
  const [articulos, setArticulos] = useState([]);
  const [form, setForm] = useState({
    idarticulo: '',
    descripcion: '',
    idlinea: '',
    unidad: '',
    stock: '',
    preciocosto: '',
    precioventa: '',
    descuento: ''
  });
  const [editando, setEditando] = useState(false);

  const fetchArticulos = async () => {
    const res = await axios.get('http://localhost:5000/articulo');
    setArticulos(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editando) {
      await axios.put(`http://localhost:5000/articulo/${form.idarticulo}`, form);
    } else {
      await axios.post('http://localhost:5000/articulo', form);
    }
    setForm({
      idarticulo: '',
      descripcion: '',
      idlinea: '',
      unidad: '',
      stock: '',
      preciocosto: '',
      precioventa: '',
      descuento: ''
    });
    setEditando(false);
    fetchArticulos();
  };

  const handleDelete = async (idarticulo) => {
    if (window.confirm('¿Eliminar este artículo?')) {
      await axios.delete(`http://localhost:5000/articulo/${idarticulo}`);
      fetchArticulos();
    }
  };

  const handleEdit = (articulo) => {
    setForm(articulo);
    setEditando(true);
  };

  useEffect(() => {
    fetchArticulos();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Gestión de Artículos</h2>
      <form onSubmit={handleSubmit}>
        <input name="idarticulo" placeholder="ID Artículo" value={form.idarticulo} onChange={handleChange} disabled={editando} required />
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required />
        <input name="idlinea" placeholder="ID Línea" value={form.idlinea} onChange={handleChange} required />
        <input name="unidad" placeholder="Unidad" value={form.unidad} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <input name="preciocosto" type="number" placeholder="Precio Costo" value={form.preciocosto} onChange={handleChange} required />
        <input name="precioventa" type="number" placeholder="Precio Venta" value={form.precioventa} onChange={handleChange} required />
        <input name="descuento" type="number" placeholder="Descuento" value={form.descuento} onChange={handleChange} required />
        <button type="submit">{editando ? 'Actualizar' : 'Agregar'}</button>
        {editando && <button onClick={() => { setForm({ idarticulo: '', descripcion: '', idlinea: '', unidad: '', stock: '', preciocosto: '', precioventa: '', descuento: '' }); setEditando(false); }}>Cancelar</button>}
      </form>

      <table border="1" cellPadding="5" cellSpacing="0" style={{ marginTop: '2rem' }}>
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((a) => (
            <tr key={a.idarticulo}>
              <td>{a.idarticulo}</td>
              <td>{a.descripcion}</td>
              <td>{a.idlinea}</td>
              <td>{a.unidad}</td>
              <td>{a.stock}</td>
              <td>{a.preciocosto}</td>
              <td>{a.precioventa}</td>
              <td>{a.descuento}</td>
              <td>
                <button onClick={() => handleEdit(a)}>Editar</button>
                <button onClick={() => handleDelete(a.idarticulo)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticulosCRUD;
*/

/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ArticulosCRUD = () => {
  const [articulos, setArticulos] = useState([]);
  const [form, setForm] = useState({
    descripcion: '',
    idlinea: '',
    unidad: '',
    stock: '',
    preciocosto: '',
    precioventa: '',
    descuento: ''
  });
  const [editando, setEditando] = useState(false);

  const fetchArticulos = async () => {
    const res = await axios.get('http://localhost:5000/articulo');
    setArticulos(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.descripcion || !form.idlinea || !form.unidad) return alert('Completa todos los campos');
    
    if (editando) {
      await axios.put(`http://localhost:5000/articulo/${form.idarticulo}`, form);
    } else {
      await axios.post('http://localhost:5000/articulo', form);
    }

    setForm({
      descripcion: '',
      idlinea: '',
      unidad: '',
      stock: '',
      preciocosto: '',
      precioventa: '',
      descuento: ''
    });
    setEditando(false);
    fetchArticulos();
  };

  const handleDelete = async (idarticulo) => {
    if (window.confirm('¿Eliminar este artículo?')) {
      await axios.delete(`http://localhost:5000/articulo/${idarticulo}`);
      fetchArticulos();
    }
  };

  const handleEdit = (articulo) => {
    setForm(articulo);
    setEditando(true);
  };

  useEffect(() => {
    fetchArticulos();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Gestión de Artículos</h2>
      <form onSubmit={handleSubmit}>
        {editando && (
          <input name="idarticulo" value={form.idarticulo} disabled />
        )}
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required />
        <input name="idlinea" placeholder="ID Línea" value={form.idlinea} onChange={handleChange} required />
        <input name="unidad" placeholder="Unidad" value={form.unidad} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <input name="preciocosto" type="number" placeholder="Precio Costo" value={form.preciocosto} onChange={handleChange} required />
        <input name="precioventa" type="number" placeholder="Precio Venta" value={form.precioventa} onChange={handleChange} required />
        <input name="descuento" type="number" placeholder="Descuento" value={form.descuento} onChange={handleChange} required />
        <button type="submit">{editando ? 'Actualizar' : 'Agregar'}</button>
        {editando && (
          <button type="button" onClick={() => {
            setForm({
              descripcion: '',
              idlinea: '',
              unidad: '',
              stock: '',
              preciocosto: '',
              precioventa: '',
              descuento: ''
            });
            setEditando(false);
          }}>Cancelar</button>
        )}
      </form>

      <table border="1" cellPadding="5" cellSpacing="0" style={{ marginTop: '2rem' }}>
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((a) => (
            <tr key={a.idarticulo}>
              <td>{a.idarticulo}</td>
              <td>{a.descripcion}</td>
              <td>{a.idlinea}</td>
              <td>{a.unidad}</td>
              <td>{a.stock}</td>
              <td>{a.preciocosto}</td>
              <td>{a.precioventa}</td>
              <td>{a.descuento}</td>
              <td>
                <button onClick={() => handleEdit(a)}>Editar</button>
                <button onClick={() => handleDelete(a.idarticulo)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticulosCRUD;
*/



/*

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../componenetes/css/articulos.css"; // Importa los estilos

const ArticulosCRUD = () => {
  const [articulos, setArticulos] = useState([]);
  const [form, setForm] = useState({
    descripcion: '',
    idlinea: '',
    unidad: '',
    stock: '',
    preciocosto: '',
    precioventa: '',
    descuento: ''
  });
  const [editando, setEditando] = useState(false);

  const fetchArticulos = async () => {
    const res = await axios.get('http://localhost:5000/articulo');
    setArticulos(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.descripcion || !form.idlinea || !form.unidad) return alert('Completa todos los campos');
    
    if (editando) {
      await axios.put(`http://localhost:5000/articulo/${form.idarticulo}`, form);
    } else {
      await axios.post('http://localhost:5000/articulo', form);
    }

    setForm({
      descripcion: '',
      idlinea: '',
      unidad: '',
      stock: '',
      preciocosto: '',
      precioventa: '',
      descuento: ''
    });
    setEditando(false);
    fetchArticulos();
  };

  const handleDelete = async (idarticulo) => {
    if (window.confirm('¿Eliminar este artículo?')) {
      await axios.delete(`http://localhost:5000/articulo/${idarticulo}`);
      fetchArticulos();
    }
  };

  const handleEdit = (articulo) => {
    setForm(articulo);
    setEditando(true);
  };

  useEffect(() => {
    fetchArticulos();
  }, []);

  return (
    <div className="articulos-container">
      <h2 className="titulo">Gestión de Artículos</h2>
      <form onSubmit={handleSubmit} className="articulos-form">
        {editando && (
          <input name="idarticulo" value={form.idarticulo} disabled />
        )}
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required />
        <input name="idlinea" placeholder="ID Línea" value={form.idlinea} onChange={handleChange} required />
        <input name="unidad" placeholder="Unidad" value={form.unidad} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <input name="preciocosto" type="number" placeholder="Precio Costo" value={form.preciocosto} onChange={handleChange} required />
        <input name="precioventa" type="number" placeholder="Precio Venta" value={form.precioventa} onChange={handleChange} required />
        <input name="descuento" type="number" placeholder="Descuento" value={form.descuento} onChange={handleChange} required />
        <button type="submit">{editando ? 'Actualizar' : 'Agregar'}</button>
        {editando && (
          <button type="button" onClick={() => {
            setForm({
              descripcion: '',
              idlinea: '',
              unidad: '',
              stock: '',
              preciocosto: '',
              precioventa: '',
              descuento: ''
            });
            setEditando(false);
          }}>Cancelar</button>
        )}
      </form>

      <table className="articulos-table">
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((a) => (
            <tr key={a.idarticulo}>
              <td>{a.idarticulo}</td>
              <td>{a.descripcion}</td>
              <td>{a.idlinea}</td>
              <td>{a.unidad}</td>
              <td>{a.stock}</td>
              <td>{a.preciocosto}</td>
              <td>{a.precioventa}</td>
              <td>{a.descuento}</td>
              <td>
                <button onClick={() => handleEdit(a)}>Editar</button>
                <button onClick={() => handleDelete(a.idarticulo)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticulosCRUD;

*/

