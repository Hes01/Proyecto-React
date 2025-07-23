import React from "react";

import "../componenetes/css/caracteristicas.css";


const Caracteristicas = () => {
  return (
    <section className="features">
      <h1>CARACTERÍSTICAS DEL SISTEMA</h1>
      <ul className="feature-list">
        <li>Fácil de usar</li>
        <li>Interfaz amigable</li>
        <li>Reportes Automáticos</li>
        <li>Gestión de datos</li>
        <li>Acceso seguro</li>
      </ul>
    </section>
  );
};

export default Caracteristicas;

/*
const Caracteristicas = () => {
  return (
    <section className="caracteristicas">
      <h1>Bienvenidos a Nuestras Caracteristicas</h1>
      <img className="history-image" src="./imagenes/alicorp.jpeg" alt="Nuestra historia"/>
      <p>
        Desde nuestra fundación en <strong>1990</strong>, hemos trabajado con pasión y dedicación para ofrecer
        soluciones innovadoras a nuestros clientes. Nuestro compromiso con la calidad y la excelencia nos ha permitido
        crecer y consolidarnos como líderes en el mercado.
      </p>
      <p>
       Hoy, seguimos con la misma visión: <strong>crear un futuro mejor</strong> con productos y servicios que marcan la diferencia.
      </p>
    </section>
  );
};

export default Caracteristicas;
*/