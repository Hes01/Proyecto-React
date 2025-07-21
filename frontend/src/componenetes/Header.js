import React, { useState, useEffect } from "react";
import "../componenetes/css/header.css";
//import "./css/header.css"
// . en ese mismo nivel 
const Header = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header" >
      <img className="logo" src="./imagenes/logo_informatica.png" alt="Logo"/>
      <h1>MI APLICACIÓN WEB</h1>
      <div className="clock" >{time.toLocaleTimeString()}</div>
    </header>
  );
};

export default Header;