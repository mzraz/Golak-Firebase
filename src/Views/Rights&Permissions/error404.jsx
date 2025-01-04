import React from "react";
import { Box } from "@mui/material";
import Logo from "../../Assets/Images/loginLogo.png";
import { useDispatch } from "react-redux";
import { logout } from "../../Store/AuthSlice/authSlice";
const PermissionsPage = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div className="p-10 body-padding">
      <h1 className="heading">Permissions & Rights</h1>
      <Box
        className="box-shadow flex flex-col items-center"
        style={{
          background: "white",
        }}
      >
        <img src={Logo} alt="" />
        <h1 className="text-center heading m-5">
          You currently do not have any permissions granted by the admin.
          <br /> Please contact your administrator to request access rights.
        </h1>

        <button className="logout-btn dropdown" onClick={() => handleLogout()}>
          Logout
        </button>
      </Box>
    </div>
  );
};

export default PermissionsPage;
