import React from "react";

import "../componenetes/css/caracteristicas.css";


const Caracteristicas = () => {
  return (
    <section className="caracteristicas">
      <h1>Bienvenidos a Nuestra Nuestras Caracteristicas</h1>
      <img className="history-image" src="./imagenes/alicorp.jpeg" alt="Nuestra historia"/>
      <p>
        Desde nuestra fundación en <strong>1990</strong>, hemos trabajado con pasión y dedicación para ofrecer
        soluciones innovadoras a nuestros clientes. Nuestro compromiso con la calidad y la excelencia nos ha permitido
        crecer y consolidarnos como líderes en el mercado.
      </p>
      <p>
        Hoy, seguimos con la misma visión: **crear un futuro mejor** con productos y servicios que marcan la diferencia.
      </p>
    </section>
  );
};

export default Caracteristicas;