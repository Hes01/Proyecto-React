CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña TEXT NOT NULL
);


INSERT INTO usuarios (nombre, email, contraseña)
VALUES 
  ('usu1', 'usu1_123@gmail.com', '123456'),
  ('usu2', 'usu2_123@gmail.com', '123456')
;


-- 📋 Tabla: EMPLEADO
--
CREATE TABLE EMPLEADO (
    IdEmpleado      SERIAL PRIMARY KEY,
    Paterno         VARCHAR(20) NOT NULL,
    Materno         VARCHAR(20) NOT NULL,
    Nombres         VARCHAR(50) NOT NULL,
    Direccion       VARCHAR(50),
    Telefono        CHAR(9) CHECK (Telefono ~ '^\d{9}$'), -- teléfono 9 dígitos
    Clave           VARCHAR(50) NOT NULL CHECK (LENGTH(Clave) >= 6)
);

-- 📋 Tabla: LINEA (categorías de artículos)
CREATE TABLE LINEA (
    IdLinea     CHAR(3) PRIMARY KEY CHECK (LENGTH(IdLinea) = 3),
    Descripcion VARCHAR(35) NOT NULL,
    Contador    INTEGER NOT NULL CHECK (Contador >= 0)
);

-- 📋 Tabla: ARTICULO
CREATE TABLE ARTICULO (
    IdArticulo     CHAR(8) PRIMARY KEY,
    Descripcion    VARCHAR(35) NOT NULL,
    IdLinea        CHAR(3) NOT NULL REFERENCES LINEA(IdLinea) ON DELETE RESTRICT,
    Unidad         VARCHAR(15) NOT NULL,
    Stock          INTEGER NOT NULL CHECK (Stock >= 0),
    PrecioCosto    NUMERIC(10,2) NOT NULL CHECK (PrecioCosto > 0),
    PrecioVenta    NUMERIC(10,2) NOT NULL CHECK (PrecioVenta > 0),
    Descuento      NUMERIC(5,2) DEFAULT 0 CHECK (Descuento >= 0)
);

-- 📋 Tabla: SOCIO (clientes y/o proveedores)
CREATE TABLE SOCIO (
    IdSocio     SERIAL PRIMARY KEY,
    Nombre      VARCHAR(50) NOT NULL,
    RUC         CHAR(11) NOT NULL UNIQUE CHECK (RUC ~ '^\d{11}$'),
    Direccion   VARCHAR(50) NOT NULL,
    Telefono    CHAR(9),
    Contacto    VARCHAR(50),
    Cliente     BOOLEAN DEFAULT FALSE,
    Proveedor   BOOLEAN DEFAULT FALSE
);

-- 📋 Tabla: PEDIDO (ventas o compras)
CREATE TABLE PEDIDO (
    Numero      SERIAL PRIMARY KEY,
    IdEmpleado  INTEGER NOT NULL REFERENCES EMPLEADO(IdEmpleado) ON DELETE RESTRICT,
    IdSocio     INTEGER NOT NULL REFERENCES SOCIO(IdSocio) ON DELETE RESTRICT,
    Tipo        INTEGER NOT NULL CHECK (Tipo IN (1, 2)), -- 1 = Venta, 2 = Compra
    Fecha       DATE NOT NULL DEFAULT CURRENT_DATE,
    SubTotal    NUMERIC(10,2) NOT NULL CHECK (SubTotal >= 0),
    Impuesto    NUMERIC(10,2) NOT NULL CHECK (Impuesto >= 0),
    Total       NUMERIC(10,2) NOT NULL CHECK (Total >= 0)
);

-- 📋 Tabla: DETALLE (detalle del pedido)
CREATE TABLE DETALLE (
    Numero        INTEGER NOT NULL REFERENCES PEDIDO(Numero) ON DELETE CASCADE,
    IdArticulo    CHAR(8) NOT NULL REFERENCES ARTICULO(IdArticulo) ON DELETE RESTRICT,
    Cantidad      INTEGER NOT NULL CHECK (Cantidad > 0),
    PrecioVenta   NUMERIC(10,2) NOT NULL CHECK (PrecioVenta > 0),
    Descuento     NUMERIC(5,2) DEFAULT 0 CHECK (Descuento >= 0),
    SubTotal      NUMERIC(10,2) NOT NULL CHECK (SubTotal >= 0),
    PRIMARY KEY (Numero, IdArticulo)
);


-- 📋 Tabla: CONTROL (parámetros del sistema)
CREATE TABLE CONTROL (
    Parametro VARCHAR(20) PRIMARY KEY,
    Valor     VARCHAR(35) NOT NULL
);


INSERT INTO CONTROL (Parametro, Valor) VALUES 
('Venta', '11'),
('Compra', '12'),
('IGV', '0.18'),
('Empleado', '5'),
('Socio', '20');


INSERT INTO LINEA (IdLinea, Descripcion, Contador) VALUES
('ELE', 'Electrodomésticos', 5),
('AUD', 'Audio', 1),
('VID', 'Video', 1),
('COM', 'Computadoras', 4),
('BLA', 'Línea Blanca', 1);


INSERT INTO ARTICULO (IdArticulo, Descripcion, IdLinea, Unidad, Stock, PrecioCosto, PrecioVenta, Descuento) VALUES
('ELE00001', 'Licuadora', 'ELE', 'unidad', 50, 120.00, 150.00, 5.00),
('ELE00002', 'Plancha', 'ELE', 'unidad', 100, 80.00, 110.00, 3.00),
('COM00001', 'Laptop i5', 'COM', 'unidad', 25, 1800.00, 2200.00, 50.00),
('COM00002', 'Monitor 24"', 'COM', 'unidad', 40, 400.00, 550.00, 20.00),
('BLA00001', 'Refrigeradora', 'BLA', 'unidad', 15, 1000.00, 1350.00, 30.00),
('VID00001', 'Smart TV 55"', 'VID', 'unidad', 12, 1500.00, 1950.00, 25.00);

INSERT INTO articulo (idarticulo, descripcion, idlinea, unidad, stock, preciocosto, precioventa, descuento)
VALUES ('ELE00010', 'Audífonos', 'ELE', 'unidad', 5, 30.00, 50.00, 2.00);

INSERT INTO EMPLEADO (Paterno, Materno, Nombres, Direccion, Telefono, Clave) VALUES
('PEREZ', 'LOPEZ', 'JUAN CARLOS', 'Av. Grau 123', '987654321', 'clave123'),
('RAMIREZ', 'CASTRO', 'LAURA INES', 'Av. Piura 456', '965874123', 'clave456'),
('ROJAS', 'GONZALES', 'MARIO ALEJANDRO', 'Calle Lima 789', '912345678', 'clave789');


INSERT INTO SOCIO (Nombre, RUC, Direccion, Telefono, Contacto, Cliente, Proveedor) VALUES
('COMERCIAL JIREH S.A.', '20123456789', 'Jr. Tarapacá 456', '984512367', 'LUIS FERNANDO', TRUE, FALSE),
('IMPORTACIONES SANTA ROSA', '20987654321', 'Av. Amazonas 789', '987321456', 'MARIA PÉREZ', FALSE, TRUE),
('FERRETERÍA EL ÉXITO', '20458963217', 'Calle Comercio 345', '943216578', 'JUAN VÁSQUEZ', TRUE, TRUE),
('DISTRIBUIDORA DEL NORTE', '20321254897', 'Av. Industrial 765', '912587469', 'SOFÍA LÓPEZ', TRUE, FALSE);


-- Asumiendo: empleado_id = 1, socio_id = 1
INSERT INTO PEDIDO (IdEmpleado, IdSocio, Tipo, Fecha, SubTotal, Impuesto, Total) VALUES
(1, 1, 1, '2025-07-10', 1000.00, 180.00, 1180.00),
(2, 2, 2, '2025-07-12', 500.00, 90.00, 590.00),
(3, 3, 1, '2025-07-14', 1350.00, 243.00, 1593.00);


-- Para pedido 1
INSERT INTO DETALLE (Numero, IdArticulo, Cantidad, PrecioVenta, Descuento, SubTotal) VALUES
(1, 'ELE00001', 2, 150.00, 5.00, 290.00),
(1, 'COM00001', 1, 2200.00, 50.00, 2150.00);

-- Para pedido 2
INSERT INTO DETALLE (Numero, IdArticulo, Cantidad, PrecioVenta, Descuento, SubTotal) VALUES
(2, 'ELE00002', 3, 110.00, 3.00, 321.00);

-- Para pedido 3
INSERT INTO DETALLE (Numero, IdArticulo, Cantidad, PrecioVenta, Descuento, SubTotal) VALUES
(3, 'BLA00001', 1, 1350.00, 30.00, 1320.00);


--Librería para excel, ejecutar en frontend: npm install xlsx file-saver
--Librería para pdf, ejecutar en el frontend: npm install jspdf jspdf-autotable



------------------------------------------------------------------------------------------------
--------------------------FUNCTION Y TRIGGER
----------------------------------------------------------------------------------------------

ALTER TABLE EMPLEADO
ADD COLUMN id_usuario INTEGER REFERENCES usuarios(id) ON DELETE SET NULL;


CREATE OR REPLACE FUNCTION actualizar_usuario_desde_empleado()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.id_usuario IS NOT NULL THEN
        UPDATE usuarios
        SET 
            nombre = NEW.Nombres || ' ' || NEW.Paterno || ' ' || NEW.Materno,
            contraseña = NEW.Clave
        WHERE id = NEW.id_usuario;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_usuario
AFTER UPDATE ON EMPLEADO
FOR EACH ROW
EXECUTE FUNCTION actualizar_usuario_desde_empleado();


select*
from usuarios

select*
from empleado

UPDATE empleado SET id_usuario = 1 WHERE idempleado = 1;
UPDATE empleado SET id_usuario = 3 WHERE idempleado = 2;
UPDATE empleado SET id_usuario = 2 WHERE idempleado = 3;