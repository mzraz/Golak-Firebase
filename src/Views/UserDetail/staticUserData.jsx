import React from "react";
import { Box, Button, TextField, Checkbox } from "@mui/material";
import Profile from "../../Assets/Images/profile.jpg";
import { FaRegEdit } from "react-icons/fa";
import Avatar from "@mui/material/Avatar";
const StaticUserData = ({ user, changeEditComponent, editData }) => {
  return (
    <Box
      className="w-full h-60 flex flex-row justify-between  mt-4 border-box"
      style={{
        background: "#F5F6FA",
      }}
    >
      <Box className="w-90 flex flex-row items-center justify-start ml-12">
        <div className="container">
          <Avatar
            src={editData.image ? editData.image : Profile}
            alt="Avatar"
            className="image"
            style={{
              height: "140px",
              width: "140px",
              marginRight: "30px",
            }}
          />
        </div>
        <Box className="ml-6">
          <h2 className="heading">{editData?.username}</h2>
          <p
            style={{
              color: "#868686",
            }}
          >
            {editData?.email}
          </p>
          <p
            style={{
              color: "#868686",
            }}
          >
            {editData?.phone}
          </p>
        </Box>
      </Box>
      <Box className="w-10 text-black mr-12 mt-3">
        <Button
          className="dropdown text-black"
          style={{
            color: "black",
            textTransform: "capitalize",
          }}
          onClick={() => changeEditComponent()}
        >
          <FaRegEdit size={20} color="black" />
          Edit
        </Button>
      </Box>
    </Box>
  );
};

export default StaticUserData;
