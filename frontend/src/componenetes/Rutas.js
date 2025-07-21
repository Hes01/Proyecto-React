import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Inicio from "./Inicio";
import Footer from "./Footer";
import Header from "./Header";
import Menu   from './Menu';
import Login  from './Login';
import Principal from '../App';
import Caracteristicas from './Caracteristicas';
import ArticulosCRUD from './ArticulosCRUD' //AGREGUÉ YO
import SociosCRUD from './SociosCRUD' //AGREGUÉ YO
import EmpleadosCRUD from './EmpleadosCRUD' //AGREGUÉ YO
import ReporteVentas from './ReporteVentas' //AGREGUÉ YO
import ReporteCompras from './ReporteCompras' //AGREGUÉ YO
import ReporteInventario from './ReporteInventario' //AGREGUÉ YO
import ReporteStockBajo from './ReporteStockBajo' //AGREGUÉ YO


function App() {
    const isAuthenticated = localStorage.getItem('token'); // Verifica si hay sesión activa

    return (
    <Router>
        <Header />
        {isAuthenticated && <Menu />}
        
        <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/cuerpo" /> : <Login />} />
        <Route path="/menu" element={isAuthenticated ? <Principal /> : <Navigate to="/" />} />
        <Route path="/inicio" element={isAuthenticated ? <Inicio /> : <Navigate to="/" />} />
        <Route path="/caracteristicas" element={isAuthenticated ? <Caracteristicas /> : <Navigate to="/" />} />
        <Route path="/articulos" element={isAuthenticated ? <ArticulosCRUD /> : <Navigate to="/" />} />
        <Route path="/socios" element={isAuthenticated ? <SociosCRUD /> : <Navigate to="/" />} />
        <Route path="/empleados" element={isAuthenticated ? <EmpleadosCRUD /> : <Navigate to="/" />} />
        <Route path="/reporte-ventas" element={isAuthenticated ? <ReporteVentas /> : <Navigate to="/" />} />
        <Route path="/reporte-compras" element={isAuthenticated ? <ReporteCompras /> : <Navigate to="/" />} />
        <Route path="/reporte-inventario" element={isAuthenticated ? <ReporteInventario /> : <Navigate to="/" />} />
        <Route path="/reporte-stock-bajo" element={isAuthenticated ? <ReporteStockBajo /> : <Navigate to="/" />} />
        </Routes>
        {isAuthenticated && <Footer />}
    </Router>
    );

    /*
    return (
        <Router>
            <Header />
            <Menu />
            <Routes>
                <Route path="/" element={isAuthenticated ? <Navigate to="/cuerpo" /> : <Login />} />
                <Route path="/menu" element={isAuthenticated ? <Principal/> : <Navigate to="/" />} />
                <Route path="/inicio" element={isAuthenticated ? <Inicio/> : <Navigate to="/" />} />
                <Route path="/caracteristicas" element={isAuthenticated ? <Caracteristicas/> : <Navigate to="/" />} />
                <Route path="/articulos" element={isAuthenticated ? <ArticulosCRUD/> : <Navigate to="/" />} />
                <Route path="/socios" element={isAuthenticated ? <SociosCRUD/> : <Navigate to="/" />} />
                <Route path="/empleados" element={isAuthenticated ? <EmpleadosCRUD/> : <Navigate to="/" />} />
                <Route path="/reporte-ventas" element={isAuthenticated ? <ReporteVentas/> : <Navigate to="/" />} />
                <Route path="/reporte-compras" element={isAuthenticated ? <ReporteCompras/> : <Navigate to="/" />} />
                <Route path="/reporte-inventario" element={isAuthenticated ? <ReporteInventario/> : <Navigate to="/" />} />
                <Route path="/reporte-stock-bajo" element={isAuthenticated ? <ReporteStockBajo/> : <Navigate to="/" />} />
            </Routes>
             <Footer />
        </Router>
    );
    */
}

export default App;


