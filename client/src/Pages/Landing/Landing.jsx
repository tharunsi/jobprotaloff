import React from "react";
import { NavLink } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing-page">
   <div className="animated-office">
  <div className="desk"></div>
  <div className="chair"></div>
  
  {/* Human */}
  <div className="person">
    <div className="head"></div>
    <div className="torso"></div>
    <div className="arm left-arm"></div>
    <div className="arm right-arm"></div>
  </div>

  {/* Monitor moved outside */}
  <div className="monitor">
    <div className="screen-glow"></div>
  </div>
</div>



      <div className="content">
        <h1 className="title">Welcome to JobPortal</h1>
        <p className="subtitle">Find your dream job, or hire the best talent!</p>
        <div className="buttons">
          <NavLink to="/login">
            <button className="btn login-btn">Login</button>
          </NavLink>
          <NavLink to="/signup">
            <button className="btn signup-btn">Sign Up</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Landing;
