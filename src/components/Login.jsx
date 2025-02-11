import React from 'react';
// import '../components/css/bootstrap.min.css';   
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/css/style.css';
import {useNavigate} from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const handleSubmit = () => {
        navigate('/myfeedback');
    };
  return (
    <div className="container-fluid" id="loginBg">
      <div className="container">
        <div className="row menu_mb">
          <div className="col-lg-12">
            <nav id="menu" className="d-flex justify-content-between">  
              <a href="/"><img src="/images/logo.svg" alt="ETMS Logo" /></a>

              <div className="d-flex justify-content-between align-items-center">
                <ul className="d-flex">
                  <a href="#!">FAQ'S</a>
                  <a href="#!">Contact Us</a>
                  <a href="#!">Transport Policy</a>
                </ul>
                <button className="btn btn-primary btn-sm">Need Help?</button>
              </div>
            </nav>
          </div>
        </div>      
        
        <div className="loginMiddle">
          <div className="row">
            <div className="col-12 col-lg-6">
              <div className="loginBx">
                <h3>Login</h3>
                <p className="overline_text">Enter your email and password to sign in</p>
                <div className="loginLeft">
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="Enter your email id.."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="form-check form-switch mb-3">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      role="switch" 
                      id="RememberMe" 
                      defaultChecked
                    />
                    <label className="form-check-label text1-body" htmlFor="RememberMe">
                      Remember me
                    </label>
                  </div>
                  <div className="d-grid">
                    <button className="btn btn-primary btn-normal" onClick={handleSubmit}>Login</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="loginRight">
                <img src="/images/icon.svg" alt="ETMS Icon" />
                <h2 className="text-white">e-Transport Management System</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <p className="text1-body">Copyright © {new Date().getFullYear()}, etms.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;