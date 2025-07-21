import React, { useState, useEffect } from "react";
import "../componenetes/css/cuerpo.css";
// import "./css/cuerpo.css"

const Cuerpo = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cuerpo">
        <h1>Integrantes</h1>
        <img className="image-cuerpo" src="./imagenes/Integrantes.png" alt="Logo"/>

        <li>Adrianzen Adanaque, Carlos David</li>
        <li>Huanca Flores, Segundo Elvis</li>
        <li>Pasache Pizarro, Cristhian Joel</li>

    </div>
  );
};



export default Cuerpo;