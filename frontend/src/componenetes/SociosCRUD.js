import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../componenetes/css/socios.css";

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
    if (form.telefono && !/^\d{9}$/.test(form.telefono)) return 'El teléfono debe tener 9 dígitos.';
    if (form.cliente && form.proveedor) return 'Solo puede ser Cliente o Proveedor, no ambos.';
    if (!form.cliente && !form.proveedor) return 'Debe marcar si es Cliente o Proveedor.';
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
        <input
          name="telefono"
          placeholder="Teléfono (9 dígitos)"
          value={form.telefono}
          onChange={handleChange}
          pattern="\d{9}"
          title="Debe contener 9 dígitos numéricos"
          maxLength={9}

        />
        
        <input name="contacto" placeholder="Contacto" value={form.contacto} onChange={handleChange} />

        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="rol"
              checked={form.cliente}
              onChange={() => setForm({ ...form, cliente: true, proveedor: false })}
            />
            Cliente
          </label>
          <label>
            <input
              type="radio"
              name="rol"
              checked={form.proveedor}
              onChange={() => setForm({ ...form, cliente: false, proveedor: true })}
            />
            Proveedor
          </label>
        </div>

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

