import axios from 'axios';
import { useState } from 'react';
import { Form, Button} from 'react-bootstrap';
import "../componenetes/css/Login.css"; //import "./css/Login.css"
const Login = () => {
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    
    
    
    const handleLogin = async () => {
    try {
        const response = await axios.post('http://localhost:5000/login', { email, contraseña });
        localStorage.setItem('token', response.data.token);
        alert('Login exitoso');
      
       window.location.href = "/menu"; // Alternativa sencilla para redirección
    } catch (error) {
             alert('Error en login');
         }

    
};

    return (
            <div className="container">
                
                <div className="imagen-login">
                    <img src='./imagenes/Login_.png' alt='Imagen en login'></img>
                </div>
                <div className="col-md-6">
                    <h3 className="signin-text mb-3">Login al Sistema</h3>
                        <Form className='formulario-login'>
                            <div className="form-group">
                                 <label htmlFor="email">Email</label>
                                 <input type='email' name='email' className='form-control' onChange={(e) => setEmail(e.target.value)}></input>
                            </div>
                            <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input type='password' name='contraseña' className='form-control' onChange={(e) => setContraseña(e.target.value)} ></input>
                            </div>
                            <Button className="btn btn-class" onClick={handleLogin}>Login</Button>
                        </Form>
                 </div>
      </div>
    );
};

export default Login

