/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmpleadosCRUD = () => {
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState({
    idempleado: '',
    paterno: '',
    materno: '',
    nombres: '',
    direccion: '',
    telefono: '',
    clave: ''
  });
  const [editando, setEditando] = useState(false);

  const fetchEmpleados = async () => {
    const res = await axios.get('http://localhost:5000/empleado');
    setEmpleados(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editando) {
      await axios.put(`http://localhost:5000/empleado/${form.idempleado}`, form);
    } else {
      await axios.post('http://localhost:5000/empleado', form);
    }
    setForm({ idempleado: '', paterno: '', materno: '', nombres: '', direccion: '', telefono: '', clave: '' });
    setEditando(false);
    fetchEmpleados();
  };

  const handleEdit = (empleado) => {
    setForm(empleado);
    setEditando(true);
  };

  const handleDelete = async (idempleado) => {
    if (window.confirm('¿Eliminar este empleado?')) {
      await axios.delete(`http://localhost:5000/empleado/${idempleado}`);
      fetchEmpleados();
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Gestión de Empleados</h2>
      <form onSubmit={handleSubmit}>
        <input name="idempleado" placeholder="ID Empleado" value={form.idempleado} onChange={handleChange} disabled={editando} required />
        <input name="paterno" placeholder="Apellido Paterno" value={form.paterno} onChange={handleChange} required />
        <input name="materno" placeholder="Apellido Materno" value={form.materno} onChange={handleChange} required />
        <input name="nombres" placeholder="Nombres" value={form.nombres} onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <input name="clave" placeholder="Clave" value={form.clave} onChange={handleChange} required />
        <button type="submit">{editando ? 'Actualizar' : 'Agregar'}</button>
        {editando && <button onClick={() => { setForm({ idempleado: '', paterno: '', materno: '', nombres: '', direccion: '', telefono: '', clave: '' }); setEditando(false); }}>Cancelar</button>}
      </form>

      <table border="1" cellPadding="5" cellSpacing="0" style={{ marginTop: '2rem' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Paterno</th>
            <th>Materno</th>
            <th>Nombres</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Clave</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((e) => (
            <tr key={e.idempleado}>
              <td>{e.idempleado}</td>
              <td>{e.paterno}</td>
              <td>{e.materno}</td>
              <td>{e.nombres}</td>
              <td>{e.direccion}</td>
              <td>{e.telefono}</td>
              <td>{e.clave}</td>
              <td>
                <button onClick={() => handleEdit(e)}>Editar</button>
                <button onClick={() => handleDelete(e.idempleado)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmpleadosCRUD;
*/

/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmpleadosCRUD = () => {
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState({
    idempleado: '',
    paterno: '',
    materno: '',
    nombres: '',
    direccion: '',
    telefono: '',
    clave: ''
  });
  const [editando, setEditando] = useState(false);

  const fetchEmpleados = async () => {
    const res = await axios.get('http://localhost:5000/empleado');
    setEmpleados(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editando) {
      await axios.put(`http://localhost:5000/empleado/${form.idempleado}`, form);
    } else {
      await axios.post('http://localhost:5000/empleado', form);
    }
    setForm({ idempleado: '', paterno: '', materno: '', nombres: '', direccion: '', telefono: '', clave: '' });
    setEditando(false);
    fetchEmpleados();
  };

  const handleDelete = async (idempleado) => {
    if (window.confirm('¿Eliminar este empleado?')) {
      await axios.delete(`http://localhost:5000/empleado/${idempleado}`);
      fetchEmpleados();
    }
  };

  const handleEdit = (empleado) => {
    setForm(empleado);
    setEditando(true);
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Gestión de Empleados</h2>
      <form onSubmit={handleSubmit}>
        <input name="paterno" placeholder="Apellido Paterno" value={form.paterno} onChange={handleChange} required />
        <input name="materno" placeholder="Apellido Materno" value={form.materno} onChange={handleChange} required />
        <input name="nombres" placeholder="Nombres" value={form.nombres} onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} pattern="\d{9}" title="Debe tener 9 dígitos" />
        <input name="clave" type="password" placeholder="Clave" value={form.clave} onChange={handleChange} required minLength="6" />
        <button type="submit">{editando ? 'Actualizar' : 'Agregar'}</button>
        {editando && <button onClick={() => { setForm({ idempleado: '', paterno: '', materno: '', nombres: '', direccion: '', telefono: '', clave: '' }); setEditando(false); }}>Cancelar</button>}
      </form>

      <table border="1" cellPadding="5" cellSpacing="0" style={{ marginTop: '2rem' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Paterno</th>
            <th>Materno</th>
            <th>Nombres</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Clave</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((e) => (
            <tr key={e.idempleado}>
              <td>{e.idempleado}</td>
              <td>{e.paterno}</td>
              <td>{e.materno}</td>
              <td>{e.nombres}</td>
              <td>{e.direccion}</td>
              <td>{e.telefono}</td>
              <td>{e.clave}</td>
              <td>
                <button onClick={() => handleEdit(e)}>Editar</button>
                <button onClick={() => handleDelete(e.idempleado)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmpleadosCRUD;

*/
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../componenetes/css/empleados.css"; // Importa el archivo de estilos

const EmpleadosCRUD = () => {
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState({
    idempleado: '',
    paterno: '',
    materno: '',
    nombres: '',
    direccion: '',
    telefono: '',
    clave: ''
  });
  const [editando, setEditando] = useState(false);

  const fetchEmpleados = async () => {
    const res = await axios.get('http://localhost:5000/empleado');
    setEmpleados(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editando) {
      await axios.put(`http://localhost:5000/empleado/${form.idempleado}`, form);
    } else {
      await axios.post('http://localhost:5000/empleado', form);
    }
    setForm({
      idempleado: '',
      paterno: '',
      materno: '',
      nombres: '',
      direccion: '',
      telefono: '',
      clave: ''
    });
    setEditando(false);
    fetchEmpleados();
  };

  const handleDelete = async (idempleado) => {
    if (window.confirm('¿Eliminar este empleado?')) {
      await axios.delete(`http://localhost:5000/empleado/${idempleado}`);
      fetchEmpleados();
    }
  };

  const handleEdit = (empleado) => {
    setForm(empleado);
    setEditando(true);
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  return (
    <div className="empleado-container">
      <h2>Gestión de Empleados</h2>
      <form onSubmit={handleSubmit} className="empleado-form">
        <input name="paterno" placeholder="Apellido Paterno" value={form.paterno} onChange={handleChange} required />
        <input name="materno" placeholder="Apellido Materno" value={form.materno} onChange={handleChange} required />
        <input name="nombres" placeholder="Nombres" value={form.nombres} onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} pattern="\d{9}" title="Debe tener 9 dígitos" />
        <input name="clave" type="password" placeholder="Clave" value={form.clave} onChange={handleChange} required minLength="6" />
        <button type="submit">{editando ? 'Actualizar' : 'Agregar'}</button>
        {editando && (
          <button type="button" onClick={() => {
            setForm({
              idempleado: '',
              paterno: '',
              materno: '',
              nombres: '',
              direccion: '',
              telefono: '',
              clave: ''
            });
            setEditando(false);
          }}>Cancelar</button>
        )}
      </form>

      <table className="empleado-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Paterno</th>
            <th>Materno</th>
            <th>Nombres</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Clave</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((e) => (
            <tr key={e.idempleado}>
              <td>{e.idempleado}</td>
              <td>{e.paterno}</td>
              <td>{e.materno}</td>
              <td>{e.nombres}</td>
              <td>{e.direccion}</td>
              <td>{e.telefono}</td>
              <td>{e.clave}</td>
              <td>
                <button onClick={() => handleEdit(e)}>Editar</button>
                <button onClick={() => handleDelete(e.idempleado)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmpleadosCRUD;
