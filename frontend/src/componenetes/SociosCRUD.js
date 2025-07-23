import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../componenetes/css/socios.css"; // Importa los estilos // Importa los estilos

const SociosCRUD = () => {
  const [socios, setSocios] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    ruc: '',
    direccion: '',
    telefono: '',
    contacto: '',
    cliente: false,
    proveedor: false
  });
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const fetchSocios = async () => {
    const res = await axios.get('http://localhost:5000/socio');
    setSocios(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const validarFormulario = () => {
    if (form.nombre.trim() === '') return 'El nombre es obligatorio.';
    if (!/^\d{11}$/.test(form.ruc)) return 'El RUC debe tener 11 dígitos.';
    if (form.direccion.trim() === '') return 'La dirección es obligatoria.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validarFormulario();
    if (error) return alert(error);

    const datos = {
      ...form,
      cliente: Boolean(form.cliente),
      proveedor: Boolean(form.proveedor)
    };

    try {
      if (editando) {
        await axios.put(`http://localhost:5000/socio/${idEditando}`, datos);
      } else {
        await axios.post('http://localhost:5000/socio', datos);
      }

      setForm({
        nombre: '',
        ruc: '',
        direccion: '',
        telefono: '',
        contacto: '',
        cliente: false,
        proveedor: false
      });
      setEditando(false);
      setIdEditando(null);
      fetchSocios();
    } catch (err) {
      alert('Error al guardar socio.');
    }
  };

  const handleDelete = async (idsocio) => {
    if (window.confirm('¿Eliminar este socio?')) {
      await axios.delete(`http://localhost:5000/socio/${idsocio}`);
      fetchSocios();
    }
  };

  const handleEdit = (socio) => {
    setForm({
      nombre: socio.nombre,
      ruc: socio.ruc,
      direccion: socio.direccion,
      telefono: socio.telefono,
      contacto: socio.contacto,
      cliente: socio.cliente,
      proveedor: socio.proveedor
    });
    setEditando(true);
    setIdEditando(socio.idsocio);
  };

  useEffect(() => {
    fetchSocios();
  }, []);

  return (
    <div className="socios-container">
      <h2 className="titulo">Gestión de Socios</h2>
      <form onSubmit={handleSubmit} className="socios-form">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="ruc" placeholder="RUC (11 dígitos)" value={form.ruc} onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <input name="contacto" placeholder="Contacto" value={form.contacto} onChange={handleChange} />
        <label className="checkbox">
          <input type="checkbox" name="cliente" checked={form.cliente} onChange={handleChange} /> Cliente
        </label>
        <label className="checkbox">
          <input type="checkbox" name="proveedor" checked={form.proveedor} onChange={handleChange} /> Proveedor
        </label>
        <button type="submit">{editando ? 'Actualizar' : 'Agregar'}</button>
        {editando && (
          <button type="button" onClick={() => {
            setForm({
              nombre: '',
              ruc: '',
              direccion: '',
              telefono: '',
              contacto: '',
              cliente: false,
              proveedor: false
            });
            setEditando(false);
            setIdEditando(null);
          }}>Cancelar</button>
        )}
      </form>

      <table className="socios-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>RUC</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Contacto</th>
            <th>Cliente</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {socios.map((s) => (
            <tr key={s.idsocio}>
              <td>{s.idsocio}</td>
              <td>{s.nombre}</td>
              <td>{s.ruc}</td>
              <td>{s.direccion}</td>
              <td>{s.telefono}</td>
              <td>{s.contacto}</td>
              <td>{s.cliente ? '✔️' : ''}</td>
              <td>{s.proveedor ? '✔️' : ''}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Editar</button>
                <button onClick={() => handleDelete(s.idsocio)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SociosCRUD;






/*import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SociosCRUD = () => {
  const [socios, setSocios] = useState([]);
  const [form, setForm] = useState({
    idsocio: '',
    nombre: '',
    ruc: '',
    direccion: '',
    telefono: '',
    contacto: '',
    cliente: false,
    proveedor: false
  });
  const [editando, setEditando] = useState(false);

  const fetchSocios = async () => {
    const res = await axios.get('http://localhost:5000/socio');
    setSocios(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datos = {
      ...form,
      cliente: form.cliente ? 1 : 0,
      proveedor: form.proveedor ? 1 : 0
    };
    if (editando) {
      await axios.put(`http://localhost:5000/socio/${form.idsocio}`, datos);
    } else {
      await axios.post('http://localhost:5000/socio', datos);
    }
    setForm({ idsocio: '', nombre: '', ruc: '', direccion: '', telefono: '', contacto: '', cliente: false, proveedor: false });
    setEditando(false);
    fetchSocios();
  };

  const handleDelete = async (idsocio) => {
    if (window.confirm('¿Eliminar este socio?')) {
      await axios.delete(`http://localhost:5000/socio/${idsocio}`);
      fetchSocios();
    }
  };

  const handleEdit = (socio) => {
    setForm({
      ...socio,
      cliente: socio.cliente === 1,
      proveedor: socio.proveedor === 1
    });
    setEditando(true);
  };

  useEffect(() => {
    fetchSocios();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Gestión de Socios</h2>
      <form onSubmit={handleSubmit}>
        <input name="idsocio" placeholder="ID Socio" value={form.idsocio} onChange={handleChange} disabled={editando} required />
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="ruc" placeholder="RUC" value={form.ruc} onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <input name="contacto" placeholder="Contacto" value={form.contacto} onChange={handleChange} />
        <label>
          <input type="checkbox" name="cliente" checked={form.cliente} onChange={handleChange} /> Cliente
        </label>
        <label>
          <input type="checkbox" name="proveedor" checked={form.proveedor} onChange={handleChange} /> Proveedor
        </label>
        <button type="submit">{editando ? 'Actualizar' : 'Agregar'}</button>
        {editando && <button onClick={() => { setForm({ idsocio: '', nombre: '', ruc: '', direccion: '', telefono: '', contacto: '', cliente: false, proveedor: false }); setEditando(false); }}>Cancelar</button>}
      </form>

      <table border="1" cellPadding="5" cellSpacing="0" style={{ marginTop: '2rem' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>RUC</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Contacto</th>
            <th>Cliente</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {socios.map((s) => (
            <tr key={s.idsocio}>
              <td>{s.idsocio}</td>
              <td>{s.nombre}</td>
              <td>{s.ruc}</td>
              <td>{s.direccion}</td>
              <td>{s.telefono}</td>
              <td>{s.contacto}</td>
              <td>{s.cliente ? '✔️' : ''}</td>
              <td>{s.proveedor ? '✔️' : ''}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Editar</button>
                <button onClick={() => handleDelete(s.idsocio)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SociosCRUD;

*/

/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SociosCRUD = () => {
  const [socios, setSocios] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    ruc: '',
    direccion: '',
    telefono: '',
    contacto: '',
    cliente: false,
    proveedor: false
  });
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const fetchSocios = async () => {
    const res = await axios.get('http://localhost:5000/socio');
    setSocios(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const validarFormulario = () => {
    if (form.nombre.trim() === '') return 'El nombre es obligatorio.';
    if (!/^\d{11}$/.test(form.ruc)) return 'El RUC debe tener 11 dígitos.';
    if (form.direccion.trim() === '') return 'La dirección es obligatoria.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validarFormulario();
    if (error) return alert(error);

    const datos = {
      ...form,
      cliente: Boolean(form.cliente),
      proveedor: Boolean(form.proveedor)
    };

    try {
      if (editando) {
        await axios.put(`http://localhost:5000/socio/${idEditando}`, datos);
      } else {
        await axios.post('http://localhost:5000/socio', datos);
      }

      setForm({
        nombre: '',
        ruc: '',
        direccion: '',
        telefono: '',
        contacto: '',
        cliente: false,
        proveedor: false
      });
      setEditando(false);
      setIdEditando(null);
      fetchSocios();
    } catch (err) {
      alert('Error al guardar socio.');
    }
  };

  const handleDelete = async (idsocio) => {
    if (window.confirm('¿Eliminar este socio?')) {
      await axios.delete(`http://localhost:5000/socio/${idsocio}`);
      fetchSocios();
    }
  };

  const handleEdit = (socio) => {
    setForm({
      nombre: socio.nombre,
      ruc: socio.ruc,
      direccion: socio.direccion,
      telefono: socio.telefono,
      contacto: socio.contacto,
      cliente: socio.cliente,
      proveedor: socio.proveedor
    });
    setEditando(true);
    setIdEditando(socio.idsocio);
  };

  useEffect(() => {
    fetchSocios();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Gestión de Socios</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="ruc" placeholder="RUC (11 dígitos)" value={form.ruc} onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <input name="contacto" placeholder="Contacto" value={form.contacto} onChange={handleChange} />
        <label>
          <input type="checkbox" name="cliente" checked={form.cliente} onChange={handleChange} /> Cliente
        </label>
        <label>
          <input type="checkbox" name="proveedor" checked={form.proveedor} onChange={handleChange} /> Proveedor
        </label>
        <button type="submit">{editando ? 'Actualizar' : 'Agregar'}</button>
        {editando && (
          <button type="button" onClick={() => {
            setForm({
              nombre: '',
              ruc: '',
              direccion: '',
              telefono: '',
              contacto: '',
              cliente: false,
              proveedor: false
            });
            setEditando(false);
            setIdEditando(null);
          }}>Cancelar</button>
        )}
      </form>

      <table border="1" cellPadding="5" cellSpacing="0" style={{ marginTop: '2rem' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>RUC</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Contacto</th>
            <th>Cliente</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {socios.map((s) => (
            <tr key={s.idsocio}>
              <td>{s.idsocio}</td>
              <td>{s.nombre}</td>
              <td>{s.ruc}</td>
              <td>{s.direccion}</td>
              <td>{s.telefono}</td>
              <td>{s.contacto}</td>
              <td>{s.cliente ? '✔️' : ''}</td>
              <td>{s.proveedor ? '✔️' : ''}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Editar</button>
                <button onClick={() => handleDelete(s.idsocio)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SociosCRUD;

*/


/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../componenetes/css/socios.css"; // Importa los estilos // Importa los estilos

const SociosCRUD = () => {
  const [socios, setSocios] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    ruc: '',
    direccion: '',
    telefono: '',
    contacto: '',
    cliente: false,
    proveedor: false
  });
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const fetchSocios = async () => {
    const res = await axios.get('http://localhost:5000/socio');
    setSocios(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const validarFormulario = () => {
    if (form.nombre.trim() === '') return 'El nombre es obligatorio.';
    if (!/^\d{11}$/.test(form.ruc)) return 'El RUC debe tener 11 dígitos.';
    if (form.direccion.trim() === '') return 'La dirección es obligatoria.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validarFormulario();
    if (error) return alert(error);

    const datos = {
      ...form,
      cliente: Boolean(form.cliente),
      proveedor: Boolean(form.proveedor)
    };

    try {
      if (editando) {
        await axios.put(`http://localhost:5000/socio/${idEditando}`, datos);
      } else {
        await axios.post('http://localhost:5000/socio', datos);
      }

      setForm({
        nombre: '',
        ruc: '',
        direccion: '',
        telefono: '',
        contacto: '',
        cliente: false,
        proveedor: false
      });
      setEditando(false);
      setIdEditando(null);
      fetchSocios();
    } catch (err) {
      alert('Error al guardar socio.');
    }
  };

  const handleDelete = async (idsocio) => {
    if (window.confirm('¿Eliminar este socio?')) {
      await axios.delete(`http://localhost:5000/socio/${idsocio}`);
      fetchSocios();
    }
  };

  const handleEdit = (socio) => {
    setForm({
      nombre: socio.nombre,
      ruc: socio.ruc,
      direccion: socio.direccion,
      telefono: socio.telefono,
      contacto: socio.contacto,
      cliente: socio.cliente,
      proveedor: socio.proveedor
    });
    setEditando(true);
    setIdEditando(socio.idsocio);
  };

  useEffect(() => {
    fetchSocios();
  }, []);

  return (
    <div className="socios-container">
      <h2 className="titulo">Gestión de Socios</h2>
      <form onSubmit={handleSubmit} className="socios-form">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="ruc" placeholder="RUC (11 dígitos)" value={form.ruc} onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <input name="contacto" placeholder="Contacto" value={form.contacto} onChange={handleChange} />
        <label className="checkbox">
          <input type="checkbox" name="cliente" checked={form.cliente} onChange={handleChange} /> Cliente
        </label>
        <label className="checkbox">
          <input type="checkbox" name="proveedor" checked={form.proveedor} onChange={handleChange} /> Proveedor
        </label>
        <button type="submit">{editando ? 'Actualizar' : 'Agregar'}</button>
        {editando && (
          <button type="button" onClick={() => {
            setForm({
              nombre: '',
              ruc: '',
              direccion: '',
              telefono: '',
              contacto: '',
              cliente: false,
              proveedor: false
            });
            setEditando(false);
            setIdEditando(null);
          }}>Cancelar</button>
        )}
      </form>

      <table className="socios-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>RUC</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Contacto</th>
            <th>Cliente</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {socios.map((s) => (
            <tr key={s.idsocio}>
              <td>{s.idsocio}</td>
              <td>{s.nombre}</td>
              <td>{s.ruc}</td>
              <td>{s.direccion}</td>
              <td>{s.telefono}</td>
              <td>{s.contacto}</td>
              <td>{s.cliente ? '✔️' : ''}</td>
              <td>{s.proveedor ? '✔️' : ''}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Editar</button>
                <button onClick={() => handleDelete(s.idsocio)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SociosCRUD;

*/