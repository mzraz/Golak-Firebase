import React from "react";
import { Box } from "@mui/material";
import Logo from "../../Assets/Images/loginLogo.png";

const UnCompleteRights = () => {
  return (
    <div className="p-10 body-padding mt-5">
      {/* <h1 className="heading">Privacy & Policy</h1> */}
      <Box
        className="box-shadow flex flex-col items-center"
        style={{
          background: "white",
        }}
      >
        <img src={Logo} alt="" />
        <h1 className="text-center heading m-5">
          You currently do not have complete permissions & rights granted by the
          admin.
          <br /> Please contact your administrator to request access complete
          rights.
        </h1>
      </Box>
    </div>
  );
};

export default UnCompleteRights;
