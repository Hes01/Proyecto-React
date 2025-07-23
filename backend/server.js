require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// === CRUD ARTÍCULO ===
app.get('/articulo', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM articulo ORDER BY idarticulo');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener artículos' });
  }
});
app.post('/articulo', async (req, res) => {
  const { descripcion, idlinea, unidad, stock, preciocosto, precioventa, descuento } = req.body;

  // Validación de idlinea
  if (!idlinea || idlinea.trim() === '') {
    return res.status(400).json({ error: "El campo 'idlinea' es obligatorio." });
  }

  try {
    await pool.query('BEGIN');
    const lineaRes = await pool.query(
      'SELECT contador FROM linea WHERE idlinea = $1 FOR UPDATE',
      [idlinea]
    );
    if (lineaRes.rowCount === 0) {
      throw new Error('Línea no encontrada');
    }

    const nuevoContador = lineaRes.rows[0].contador + 1;
    const idarticulo = idlinea + nuevoContador.toString().padStart(5, '0');

    await pool.query('UPDATE linea SET contador = $1 WHERE idlinea = $2', [nuevoContador, idlinea]);

    const result = await pool.query(
      `INSERT INTO articulo 
        (idarticulo, descripcion, idlinea, unidad, stock, preciocosto, precioventa, descuento)
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [idarticulo, descripcion, idlinea, unidad, stock, preciocosto, precioventa, descuento]
    );

    await pool.query('COMMIT');
    res.status(201).json(result.rows[0]);

  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Error al agregar artículo' });
  }
});

app.put('/articulo/:idarticulo', async (req, res) => {
  const { idarticulo } = req.params;
  const { descripcion, idlinea, unidad, stock, preciocosto, precioventa, descuento } = req.body;

  //  Validación de idlinea
  if (!idlinea || idlinea.trim() === '') {
    return res.status(400).json({ error: "El campo 'idlinea' es obligatorio." });
  }

  try {
    const result = await pool.query(
      `UPDATE articulo SET 
         descripcion = $1, idlinea = $2, unidad = $3, stock = $4,
         preciocosto = $5, precioventa = $6, descuento = $7
       WHERE idarticulo = $8
       RETURNING *`,
      [descripcion, idlinea, unidad, stock, preciocosto, precioventa, descuento, idarticulo]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar artículo' });
  }
});

app.delete('/articulo/:idarticulo', async (req, res) => {
  const { idarticulo } = req.params;
  try {
    await pool.query('DELETE FROM articulo WHERE idarticulo = $1', [idarticulo]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar artículo' });
  }
});


// === CRUD para SOCIO ===
// Obtener todos los socios
app.get('/socio', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM socio ORDER BY idsocio');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener socios' });
  }
});

// Agregar nuevo socio (sin enviar IdSocio)
app.post('/socio', async (req, res) => {
  const { nombre, ruc, direccion, telefono, contacto, cliente, proveedor } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO socio (nombre, ruc, direccion, telefono, contacto, cliente, proveedor)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [nombre, ruc, direccion, telefono, contacto, cliente, proveedor]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar socio', detalle: error.message });
  }
});

// Actualizar socio
app.put('/socio/:idsocio', async (req, res) => {
  const { idsocio } = req.params;
  const { nombre, ruc, direccion, telefono, contacto, cliente, proveedor } = req.body;

  try {
    const result = await pool.query(
      `UPDATE socio 
       SET nombre=$1, ruc=$2, direccion=$3, telefono=$4, contacto=$5, cliente=$6, proveedor=$7
       WHERE idsocio=$8
       RETURNING *`,
      [nombre, ruc, direccion, telefono, contacto, cliente, proveedor, idsocio]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar socio' });
  }
});

// Eliminar socio
app.delete('/socio/:idsocio', async (req, res) => {
  const { idsocio } = req.params;
  try {
    await pool.query('DELETE FROM socio WHERE idsocio = $1', [idsocio]);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar socio' });
  }
});



// === CRUD para EMPLEADO ===
// Obtener todos los empleados
app.get('/empleado', async (req, res) => {
  const result = await pool.query('SELECT * FROM empleado ORDER BY idempleado');
  res.json(result.rows);
});

// Agregar nuevo empleado
app.post('/empleado', async (req, res) => {
  const { paterno, materno, nombres, direccion, telefono, clave } = req.body;

  const result = await pool.query(
    `INSERT INTO empleado (paterno, materno, nombres, direccion, telefono, clave)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [paterno, materno, nombres, direccion, telefono, clave]
  );

  res.json(result.rows[0]);
});

// Actualizar empleado
app.put('/empleado/:idempleado', async (req, res) => {
  const { idempleado } = req.params;
  const { paterno, materno, nombres, direccion, telefono, clave } = req.body;

  const result = await pool.query(
    `UPDATE empleado SET paterno=$1, materno=$2, nombres=$3, direccion=$4, telefono=$5, clave=$6
     WHERE idempleado=$7 RETURNING *`,
    [paterno, materno, nombres, direccion, telefono, clave, idempleado]
  );

  res.json(result.rows[0]);
});

// Eliminar empleado
app.delete('/empleado/:idempleado', async (req, res) => {
  const { idempleado } = req.params;
  await pool.query('DELETE FROM empleado WHERE idempleado = $1', [idempleado]);
  res.sendStatus(204);
});


// Reporte: Ventas por Rango de Fechas
app.get('/reporte/ventas', async (req, res) => {
  const { desde, hasta } = req.query;

  if (!desde || !hasta) {
    return res.status(400).json({ error: 'Debe proporcionar fechas "desde" y "hasta"' });
  }

  try {
    const result = await pool.query(
      `SELECT p.Numero, s.Nombre AS cliente, p.Fecha, p.SubTotal, p.Impuesto, p.Total
       FROM PEDIDO p
       JOIN SOCIO s ON p.IdSocio = s.IdSocio
       WHERE p.Tipo = 1 -- solo ventas
       AND p.Fecha BETWEEN $1 AND $2
       ORDER BY p.Fecha`,
      [desde, hasta]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error generando reporte de ventas:', error);
    res.status(500).json({ error: 'Error generando reporte de ventas' });
  }
});

// Reporte: Compras por Rango de Fechas
app.get('/reporte/compras', async (req, res) => {
  const { desde, hasta } = req.query;

  if (!desde || !hasta) {
    return res.status(400).json({ error: 'Debe proporcionar fechas "desde" y "hasta"' });
  }

  try {
    const result = await pool.query(
      `SELECT p.Numero, s.Nombre AS proveedor, p.Fecha, p.SubTotal, p.Impuesto, p.Total
       FROM PEDIDO p
       JOIN SOCIO s ON p.IdSocio = s.IdSocio
       WHERE p.Tipo = 2 -- solo compras
       AND p.Fecha BETWEEN $1 AND $2
       ORDER BY p.Fecha`,
      [desde, hasta]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error generando reporte de compras:', error);
    res.status(500).json({ error: 'Error generando reporte de compras' });
  }
});

// Reporte: Inventario actual
app.get('/reporte/inventario', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.IdArticulo, a.Descripcion, l.Descripcion AS Linea, a.Unidad, a.Stock,
              a.PrecioCosto, a.PrecioVenta, a.Descuento
       FROM ARTICULO a
       JOIN LINEA l ON a.IdLinea = l.IdLinea
       ORDER BY a.IdArticulo`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error generando reporte de inventario:', error);
    res.status(500).json({ error: 'Error generando reporte de inventario' });
  }
});

// Reporte: Artículos con stock bajo (stock <= 10)
app.get('/reporte/stock-bajo', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.IdArticulo, a.Descripcion, l.Descripcion AS Linea, a.Unidad, a.Stock
       FROM ARTICULO a
       JOIN LINEA l ON a.IdLinea = l.IdLinea
       WHERE a.Stock <= 10
       ORDER BY a.Stock ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error generando reporte de stock bajo:', error);
    res.status(500).json({ error: 'Error generando reporte de stock bajo' });
  }
});



/*
//ARTICULO:
// === CRUD para ARTICULO ===
// Obtener articulo
app.get('/articulo', async (req, res) => {
    const result = await pool.query('SELECT * FROM articulo');
    res.json(result.rows);
});
// Agregar articulo
app.post('/articulo', async (req, res) => {
    const { idarticulo, descripcion, idlinea, unidad, stock, preciocosto, precioventa, descuento } = req.body;
        const result = await pool.query(
            `INSERT INTO articulo (idarticulo, descripcion, idlinea, unidad, stock, preciocosto, precioventa, descuento)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [idarticulo, descripcion, idlinea, unidad, stock, preciocosto, precioventa, descuento]
        );
        res.json(result.rows[0]);    
});
// Actualizar articulo
app.put('/articulo/:idarticulo', async (req, res) => {
  const { idarticulo } = req.params;
  const { descripcion, idlinea, unidad, stock, preciocosto, precioventa, descuento } = req.body;

  const result = await pool.query(
    `UPDATE articulo SET descripcion = $1, idlinea = $2, unidad = $3, stock = $4,
     preciocosto = $5, precioventa = $6, descuento = $7 WHERE idarticulo = $8 RETURNING *`,
    [descripcion, idlinea, unidad, stock, preciocosto, precioventa, descuento, idarticulo]
  );
  res.json(result.rows[0]);
});
// Eliminar articulo
app.delete('/articulo/:idarticulo', async (req, res) => {
    const { idarticulo } = req.params;
    await pool.query('DELETE FROM articulo WHERE idarticulo = $1', [idarticulo]);
    res.sendStatus(204);
});



//SOCIO:
// === CRUD para SOCIO ===
// Obtener todos los socios
app.get('/socio', async (req, res) => {
  const result = await pool.query('SELECT * FROM socio ORDER BY idsocio');
  res.json(result.rows);
});
// Agregar nuevo socio
app.post('/socio', async (req, res) => {
  const { idsocio, nombre, ruc, direccion, telefono, contacto, cliente, proveedor } = req.body;
  const result = await pool.query(
    `INSERT INTO socio (idsocio, nombre, ruc, direccion, telefono, contacto, cliente, proveedor)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [idsocio, nombre, ruc, direccion, telefono, contacto, cliente, proveedor]
  );
  res.json(result.rows[0]);
});
// Actualizar socio
app.put('/socio/:idsocio', async (req, res) => {
  const { idsocio } = req.params;
  const { nombre, ruc, direccion, telefono, contacto, cliente, proveedor } = req.body;
  const result = await pool.query(
    `UPDATE socio SET nombre=$1, ruc=$2, direccion=$3, telefono=$4,
     contacto=$5, cliente=$6, proveedor=$7 WHERE idsocio=$8 RETURNING *`,
    [nombre, ruc, direccion, telefono, contacto, cliente, proveedor, idsocio]
  );
  res.json(result.rows[0]);
});
// Eliminar socio
app.delete('/socio/:idsocio', async (req, res) => {
  const { idsocio } = req.params;
  await pool.query('DELETE FROM socio WHERE idsocio = $1', [idsocio]);
  res.sendStatus(204);
});


// === CRUD para EMPLEADO ===
// Obtener todos los empleados
app.get('/empleado', async (req, res) => {
  const result = await pool.query('SELECT * FROM empleado ORDER BY idempleado');
  res.json(result.rows);
});
// Agregar nuevo empleado
app.post('/empleado', async (req, res) => {
  const { idempleado, paterno, materno, nombres, direccion, telefono, clave } = req.body;
  const result = await pool.query(
    `INSERT INTO empleado (idempleado, paterno, materno, nombres, direccion, telefono, clave)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [idempleado, paterno, materno, nombres, direccion, telefono, clave]
  );
  res.json(result.rows[0]);
});
// Actualizar empleado
app.put('/empleado/:idempleado', async (req, res) => {
  const { idempleado } = req.params;
  const { paterno, materno, nombres, direccion, telefono, clave } = req.body;
  const result = await pool.query(
    `UPDATE empleado SET paterno=$1, materno=$2, nombres=$3, direccion=$4, telefono=$5, clave=$6
     WHERE idempleado=$7 RETURNING *`,
    [paterno, materno, nombres, direccion, telefono, clave, idempleado]
  );
  res.json(result.rows[0]);
});
// Eliminar empleado
app.delete('/empleado/:idempleado', async (req, res) => {
  const { idempleado } = req.params;
  await pool.query('DELETE FROM empleado WHERE idempleado = $1', [idempleado]);
  res.sendStatus(204);
});



//CONTACTO:
// === CRUD para CONTACTO ===
// Obtener contactos
app.get('/contactos', async (req, res) => {
    const result = await pool.query('SELECT * FROM contactos');
    res.json(result.rows);
});
// Agregar contacto
app.post('/contactos', async (req, res) => {
    const { nombre, telefono } = req.body;
    const result = await pool.query('INSERT INTO contactos (nombre, telefono) VALUES ($1, $2) RETURNING *', [nombre, telefono]);
    res.json(result.rows[0]);
});
// Eliminar contacto
app.delete('/contactos/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM contactos WHERE id = $1', [id]);
    res.sendStatus(204);
});
*/





//==MENSAJES DE AYUDA==
app.listen(5000, () => {
    console.log('Servidor corriendo en el puerto 5000');
});
console.log("Conectado a la base de datos:", process.env.DB_NAME);  //agregé yo

app.post('/login', async (req, res) => {
    const { email, contraseña } = req.body;
    const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (user.rows.length === 0) return res.status(400).json({ error: 'Usuario no encontrado' });

    let validPassword = false
    if (contraseña == user.rows[0].contraseña) {
        validPassword = true
    }
    if (!validPassword) return res.status(400).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.rows[0].id }, 'secreto', { expiresIn: '1h' });
    res.json({ token });
});


/*
MIO QUE FUNCIONA EN EL OTRO PROYECTO QUE ESTUVE AVANZANDO
app.post('/login', async (req, res) => {
    try {
        const { email, contraseña } = req.body;

        const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        const validPassword = contraseña === user.rows[0].contraseña;

        if (!validPassword) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.rows[0].id }, 'secreto', { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        console.error('Error en /login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
*/