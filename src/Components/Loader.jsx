import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Logo from "../Assets/Images/loginLogo.png";

const Loader = () => {
  return (
    <div className="overlay">
      <div className="logo-container">
        <img src={Logo} alt="" className="logo" />
      </div>
      <div className="progress-container">
        <div className="circles">
          <div className="circle1"></div>
          <div className="circle2"></div>
          <div className="circle3"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
