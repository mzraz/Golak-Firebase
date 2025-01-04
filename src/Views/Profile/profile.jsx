import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import Profile from "../../Assets/Images/profile.jpg";
import { FaImage } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { initialAuth } from "../../Store/AuthSlice/authSlice";
import { auth } from "../../Firebase/Firebase";
import { updatePassword, signInWithEmailAndPassword } from "firebase/auth";
import { updateDoc, collection, getDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../Firebase/Firebase";
import { fireStore } from "../../Firebase/Firebase";
import { useDispatch } from "react-redux";
import Loader from "../../Components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { userDataUpdate } from "../../Store/AuthSlice/authSlice";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { TbCameraUp } from "react-icons/tb";
const ProfileData = () => {
  const dispatch = useDispatch();
  const [displayLoader, setDisplayLoader] = useState(false);
  const [imageUploadData, setImageUpload] = useState();
  const [displayImage, setdisplayImage] = useState();
  const [updatePass, setUpdatePass] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    showOldPassword: false,
  });

  const [errors, setErrors] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
  const user = useSelector(initialAuth);
  const userData = user?.user;
  const [editData, setEditData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    contactNo: userData.contactNo,
    role: userData.role,
    email: userData.email,
    id: userData.id,
    imgUrl: "",
  });

  const [adminErrors, setAdminErrors] = useState({
    firstName: "",
    contactNo: "",
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    const trimmedValue = value.trim();
    setEditData({
      ...editData,
      [name]: trimmedValue,
    });
  };

  const imageUpload = (event) => {
    const imageData = event.target.files[0];
    setImageUpload(imageData);
    if (imageData) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setdisplayImage(event.target.result);
      };
      reader.readAsDataURL(imageData);
    }
  };

  const handleChangePass = (event) => {
    const { name, value } = event.target;
    const trimmedValue = value.trim();
    setUpdatePass({
      ...updatePass,
      [name]: trimmedValue,
    });
  };

  const handleSubmit = () => {
    let passErrors = {
      firstName: "",
      contactNo: "",
    };
    if (!editData.firstName) {
      passErrors = {
        ...passErrors,
        firstName: "Firstname cannot be empty!",
      };
    } else if (
      editData.firstName.length < 3 ||
      editData.firstName.length > 32
    ) {
      passErrors = {
        ...passErrors,
        firstName: "FirstName must be between 3 and 32 characters long.",
      };
    } else {
      passErrors = {
        ...passErrors,
        firstName: "",
      };
    }
    if (!editData.contactNo) {
      passErrors = {
        ...passErrors,
        contactNo: "Contact Number must not be empty!",
      };
    } else if (
      editData.contactNo.length < 10 ||
      editData.contactNo.length > 16
    ) {
      passErrors = {
        ...passErrors,
        contactNo: "Contact number must be between 10 and 16 characters long.",
      };
    } else {
      passErrors = {
        ...passErrors,
        contactNo: "",
      };
    }

    setAdminErrors(passErrors);

    if (passErrors.contactNo === "" && passErrors.firstName === "") {
      try {
        setDisplayLoader(true);
        const usersCollectionRef = collection(fireStore, "Admins");
        if (imageUploadData === undefined) {
          const userDocRef = doc(usersCollectionRef, userData.id);
          updateDoc(userDocRef, {
            contactNo: editData.contactNo,
            firstName: editData.firstName,
            lastName: editData.lastName,
          })
            .then(() => {
              return getDoc(doc(usersCollectionRef, userData.id));
            })
            .then((docSnapshot) => {
              const updatedData = docSnapshot.data();
              const id = docSnapshot.id;
              dispatch(userDataUpdate({ ...updatedData, id: id }));
              setEditData(updatedData);
              setDisplayLoader(false);
              toast.success(
                `${
                  userData.role === "superadmin" ? "Superadmin" : "Admin"
                } information has been updated.`,
                {
                  className: "toast-center",
                }
              );
            });
        } else {
          const imageRef = ref(storage, `images/${userData.id}`);
          uploadBytes(imageRef, imageUploadData)
            .then((snapshot) => {
              return getDownloadURL(snapshot.ref);
            })
            .then((url) => {
              const userDocRef = doc(usersCollectionRef, userData.id);
              return updateDoc(userDocRef, {
                imgUrl: url,
                contactNo: editData.contactNo,
                firstName: editData.firstName,
                lastName: editData.lastName,
              });
            })
            .then(() => {
              return getDoc(doc(usersCollectionRef, userData.id));
            })
            .then((docSnapshot) => {
              const updatedData = docSnapshot.data();
              const id = docSnapshot.id;
              dispatch(userDataUpdate({ ...updatedData, id: id }));
              setEditData(updatedData);
              setDisplayLoader(false);
              toast.success(`${userData.role} information has been updated.`, {
                className: "toast-center",
              });
            })
            .catch((error) => {
              setDisplayLoader(false);
            });
        }
      } catch (error) {
        setDisplayLoader(false);

        console.error("Error fetching users:", error);
      }
    }
  };

  const handleUpdatePassword = () => {
    let passErrors = {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    };
    if (!updatePass.password) {
      passErrors = {
        ...passErrors,
        password: "Password must be at least 8 characters long",
      };
    } else {
      passErrors = {
        ...passErrors,
        password: "",
      };
    }

    if (!updatePass.oldPassword) {
      passErrors = {
        ...passErrors,
        oldPassword: "Password must be at least 8 characters long",
      };
    } else {
      passErrors = {
        ...passErrors,
        oldPassword: "",
      };
    }

    if (updatePass.password !== updatePass.confirmPassword) {
      passErrors = {
        ...passErrors,
        confirmPassword: "Password does not match.",
      };
    } else {
      passErrors = {
        ...passErrors,
        confirmPassword: "",
      };
    }

    setErrors(passErrors);

    if (
      passErrors.confirmPassword === "" &&
      passErrors.password === "" &&
      passErrors.oldPassword === ""
    ) {
      setDisplayLoader(true);
      const user = auth.currentUser;
      if (user) {
        signInWithEmailAndPassword(auth, user.email, updatePass?.oldPassword)
          .then(() => {
            updatePassword(user, updatePass?.password)
              .then(() => {
                toast.success("Password updated successfully!", {
                  className: "toast-center",
                });
                setUpdatePass({
                  oldPassword: "",
                  password: "",
                  confirmPassword: "",
                  showPassword: false,
                  showConfirmPassword: false,
                  showOldPassword: false,
                });
                setDisplayLoader(false);
              })
              .catch((error) => {
                setDisplayLoader(false);
                toast.error(`Error updating password`);
              });
          })
          .catch((error) => {
            setDisplayLoader(false);
            toast.error(`Old Password is not correct!`, {
              className: "toast-center",
            });
          });
      }
    }
  };
  return (
    <>
      <div className="p-10 body-padding">
        <h1 className="heading">My Profile</h1>
        <Box className="box-shadow">
          {displayLoader ? <Loader /> : ""}
          <Toaster />
          <Box
            className="w-full"
            style={{
              borderBottom: "1px solid #F1F1F1",
            }}
          >
            {" "}
            <h1
              className="heading"
              style={{
                width: "16%",
                color: "#3E97FF",
                borderBottom: "1px solid #3E97FF",
              }}
            >
              Account Details
            </h1>
            <Box className="w-full flex flex-col  items-center border-box ">
              <Box className="w-25  h-80 flex flex-col justify-center items-center mt-4 border-box">
                <div className="container">
                  <img
                    src={
                      displayImage
                        ? displayImage
                        : userData.imgUrl
                        ? userData.imgUrl
                        : Profile
                    }
                    alt="Avatar"
                    className="image"
                    style={{
                      height: "110px",
                      width: "140px",
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
                        <TbCameraUp size={30} color="#76D0B7" />
                      </Button>
                    </label>
                  </div>
                </div>
                <p className="text-center mt-3">Allowed *.jpeg, *.jpg, *.png</p>
              </Box>
              <Box className="w-full h-60 flex flex-col  mt-4  ml-3 mb-4">
                <Box className="flex flex-row justify-between m-4">
                  <TextField
                    className="w-50p mr-3"
                    id="outlined-basic"
                    label="First Name*"
                    variant="outlined"
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={editData.firstName}
                    error={!!adminErrors.firstName}
                    helperText={adminErrors.firstName}
                    onChange={(e) => handleChange(e)}
                  ></TextField>
                  <TextField
                    className="w-50p mr-3"
                    id="outlined-basic"
                    label="Last Name"
                    variant="outlined"
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={editData.lastName}
                    onChange={(e) => handleChange(e)}
                  ></TextField>
                </Box>
                <Box className="flex flex-row justify-between m-4">
                  <TextField
                    className="w-50p mr-3"
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
                    className="w-50p mr-3"
                    id="outlined-basic"
                    label="Phone Number*"
                    variant="outlined"
                    type="number"
                    name="contactNo"
                    placeholder="Phone Number"
                    error={!!adminErrors.contactNo}
                    helperText={adminErrors.contactNo}
                    value={editData.contactNo}
                    onChange={(e) => handleChange(e)}
                  ></TextField>
                </Box>
              </Box>
            </Box>
            <Box className=" flex flex-row justify-end items-end  p-5">
              <Button
                variant="contained"
                sx={{
                  background: "#3E97FF",
                  color: "white",
                }}
                //   disabled={!user}
                className="dropdown w-full"
                onClick={() => handleSubmit()}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Box>

        <Box className="box-shadow mt-5">
          <Box
            className="w-full"
            style={{
              borderBottom: "1px solid #F1F1F1",
            }}
          >
            {" "}
            <h1
              className="heading"
              style={{
                width: "18%",
                color: "#3E97FF",
                borderBottom: "1px solid #3E97FF",
              }}
            >
              Update Password
            </h1>
            <Box className="w-full flex flex-col  items-center border-box ">
              <Box className="w-full h-90 flex flex-col  mt-4  ml-3 mb-4">
                <Box className="flex flex-row justify-between m-4">
                  <TextField
                    className="w-full mr-3"
                    id="outlined-basic"
                    label="Old Password*"
                    variant="outlined"
                    type={updatePass.showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    placeholder="Old Password"
                    value={updatePass.oldPassword}
                    onChange={(event) => handleChangePass(event)}
                    error={!!errors.oldPassword}
                    helperText={errors.oldPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setUpdatePass((prevState) => ({
                                ...prevState,
                                showOldPassword: !prevState.showOldPassword,
                              }))
                            }
                            className="dropdown"
                            edge="end"
                          >
                            {updatePass.showOldPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  ></TextField>
                </Box>
                <Box className="flex flex-row justify-between m-4">
                  <TextField
                    className="w-50p mr-3"
                    id="outlined-basic"
                    label="New Password*"
                    variant="outlined"
                    type={updatePass.showPassword ? "text" : "password"}
                    name="password"
                    placeholder="New Password*"
                    value={updatePass.password}
                    onChange={(event) => handleChangePass(event)}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setUpdatePass((prevState) => ({
                                ...prevState,
                                showPassword: !prevState.showPassword,
                              }))
                            }
                            className="dropdown"
                            edge="end"
                          >
                            {updatePass.showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  ></TextField>
                  <TextField
                    className="w-50p mr-3"
                    id="outlined-basic"
                    label="Confirm Password"
                    variant="outlined"
                    type={updatePass.showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={updatePass.confirmPassword}
                    onChange={(event) => handleChangePass(event)}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setUpdatePass((prevState) => ({
                                ...prevState,
                                showConfirmPassword:
                                  !prevState.showConfirmPassword,
                              }))
                            }
                            className="dropdown"
                            edge="end"
                          >
                            {updatePass.showConfirmPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box className=" flex flex-row justify-end items-end  p-5">
                  <Button
                    variant="contained"
                    sx={{
                      background: "#3E97FF",
                      color: "white",
                    }}
                    // disabled={!user}
                    className="dropdown w-full "
                    onClick={() => handleUpdatePassword()}
                  >
                    Update Password
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default ProfileData;
