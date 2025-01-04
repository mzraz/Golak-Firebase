import React, { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import Profile from "../../Assets/Images/profile.jpg";
import { FaImage } from "react-icons/fa6";

const EditableUserData = ({
  user,
  setEditData,
  imageUpload,
  displayImage,
  handleSubmit,
  editData,
  replicaData,
}) => {
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    phone: "",
  });
  useEffect(() => {
    const isChanged = JSON.stringify(editData) !== JSON.stringify(replicaData);
    setIsDataChanged(isChanged);
  }, [editData, replicaData]);

  useEffect(() => {
    if (displayImage !== undefined && displayImage !== null) {
      setIsDataChanged(true);
    }
  }, [displayImage]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (value === "") {
      if (name === "username") {
        setErrors({
          ...errors,
          username: "Username cannot be empty!",
        });
        setEditData({
          ...editData,
          [name]: value.trim(),
        });
      } else {
        setErrors({
          ...errors,
          phone: "Contact number cannot be empty!",
        });
        setEditData({
          ...editData,
          [name]: value.trim(),
        });
      }
    } else {
      if (name === "username") {
        setEditData({
          ...editData,
          [name]: value.trim(),
        });
        setErrors({
          ...errors,
          username: "",
        });
      } else {
        setEditData({
          ...editData,
          [name]: value.trim(),
        });
        setErrors({
          ...errors,
          phone: "",
        });
      }
    }
  };
  return (
    <>
      {" "}
      <Box className="w-full flex flex-row">
        <Box className="w-25  h-80 flex flex-col justify-center items-center mt-4 border-box">
          <div className="container">
            <img
              src={
                displayImage ? displayImage : user.image ? user.image : Profile
              }
              alt="Avatar"
              className="image"
              style={{
                width: "140px",
                height: "100px",
              }}
            />
            <div className="middle">
              <label htmlFor="upload-photo">
                <input
                  style={{ display: "none" }}
                  id="upload-photo"
                  name="upload-photo"
                  type="file"
                  onChange={(event) => imageUpload(event)}
                />
                <Button component="span">
                  <FaImage size={20} color="#76D0B7" />
                </Button>
              </label>
            </div>
          </div>
          <p className="text-center mt-3">Allowed *.jpeg, *.jpg, *.png</p>
        </Box>
        <Box className="w-75 h-60 flex flex-col border-box m-5 ml-3">
          <Box className="flex flex-row justify-between m-5">
            <TextField
              className="w-50p marginRight"
              id="outlined-basic"
              label="User Name*"
              variant="outlined"
              type="text"
              placeholder="User Name"
              name="username"
              value={editData.username}
              error={!!errors.username}
              helperText={errors.username}
              onChange={(e) => handleChange(e)}
            ></TextField>
            <TextField
              className="w-50p marginLeft"
              id="outlined-basic"
              label="ID"
              variant="outlined"
              type="text"
              name="ID"
              placeholder="ID"
              disabled
              value={editData.id}
            ></TextField>
          </Box>
          <Box className="flex flex-row justify-between ml-5 mr-5 ">
            <TextField
              className="w-50p marginRight"
              id="outlined-basic"
              label="Email"
              variant="outlined"
              type="text"
              name="email"
              placeholder="Email"
              disabled
              value={editData.email}
            ></TextField>
            <TextField
              className="w-50p marginLeft"
              id="outlined-basic"
              label="Phone Number*"
              variant="outlined"
              type="number"
              name="phone"
              placeholder="Phone Number"
              value={editData.phone}
              error={!!errors.phone}
              helperText={errors.phone}
              onChange={(e) => handleChange(e)}
            ></TextField>
          </Box>
        </Box>
      </Box>
      <Box className="flex flex-row justify-end items-end">
        <Button
          variant="contained"
          sx={{
            background: "#3E97FF",
            color: "white",
          }}
          disabled={!isDataChanged || !user}
          className="dropdown"
          onClick={() => handleSubmit()}
        >
          Save Changes
        </Button>
      </Box>
    </>
  );
};

export default EditableUserData;
