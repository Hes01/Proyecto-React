import React from "react";
import { Nav } from "react-bootstrap";



//eliminé la palabra button
function Menu() {
    return (

      <Nav  className="menu" defaultActiveKey="./componenetes/Inicio">
      <Nav.Link href="/Inicio">Inicio</Nav.Link>
      <Nav.Link href="/caracteristicas">Características</Nav.Link>
      <Nav.Link href="/articulos">Artículos</Nav.Link>  
      <Nav.Link href="/socios">Socios</Nav.Link> 
      <Nav.Link href="/empleados">Empleados</Nav.Link>
      <Nav.Link href="/reporte-ventas">Reporte de Ventas</Nav.Link>
      <Nav.Link href="/reporte-compras">Reporte de Compras</Nav.Link>
      <Nav.Link href="/reporte-inventario">Inventario Actual</Nav.Link>
      <Nav.Link href="/reporte-stock-bajo">Stock Bajo</Nav.Link>
      <Nav.Link onClick={() => { localStorage.removeItem('token'); 
                 window.location.href = '/'; }}>Cerrar sesión</Nav.Link>

 
    </Nav>
  );

}
export default Menu;