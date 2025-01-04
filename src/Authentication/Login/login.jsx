import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { FormHelperText } from "@mui/material";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Container, FormControl } from "@mui/material";
import { Link as Link2 } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { loginUser } from "../../Store/AuthSlice/authSlice";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import LoginSide from "../../Assets/Images/LoginSide.png";
import DarkLogo from "../../Assets/Images/loginLogo.png";
import Logo from "../../Assets/Images/loginLogo.png";
import LogoText from "../../Assets/Images/LogoText.png";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SignIn() {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(true);
  const [severity, setSeverity] = useState("success");
  const [error, setErrors] = useState({});
  const [isDisable, setIsDisable] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // const [loading, setLoding] = useState(true);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("You must enter a valid email")
      .required("You must enter an email")
      .test("valid-email", "Invalid email format", (value) => {
        return yup.string().email().isValidSync(value);
      }),
    password: yup
      .string()
      .min(8, "Password is too short - must be at least 8 characters.")
      .required("Please enter your password."),
  });

  const handleBlur = (e) => {
    const { name } = e?.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(loginUser(formData))
      .unwrap()
      .then((data) => {
        setMessage("Login Successfully!");
        setSeverity("success");
        setOpen(true);
        // Navigate("/");
      })
      .catch(({ errors, statusCode }) => {
        if (statusCode === 400) {
          setErrors("Invalid Credentials");
        } else if (statusCode === 500) {
          setMessage(
            "We encountered an issue while processing your request. Please try again later or contact support if the problem persists"
          );
          setSeverity("error");
          setOpen(true);
        } else if (statusCode === 401) {
          setMessage("Invalid Credentials");
          setSeverity("error");
          setOpen(true);
        } else if (statusCode === 404) {
          setMessage("Invalid Credentials");
          setSeverity("error");
          setOpen(true);
        } else if (statusCode === 401) {
          setMessage("This account is not Activated.");
          setSeverity("error");
          setOpen(true);
        } else {
          setMessage("Invalid Credentials");
          setSeverity("error");
          setOpen(true);
        }
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const updateWidth = () => {
      const newWidth = window.innerWidth;

      if (newWidth >= 600) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    window.addEventListener("resize", updateWidth);

    updateWidth();
    setIsDisable(Object?.keys(error)?.length === 0 ? false : true);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [isDisable]);

  useEffect(() => {
    const validateForm = async () => {
      try {
        await validationSchema.validate(formData, { abortEarly: false });
        setErrors({});
        setIsDisable(false);
      } catch (err) {
        const formattedErrors = err?.inner?.reduce((acc, curr) => {
          acc[curr?.path] = curr?.message;
          return acc;
        }, {});
        setErrors(formattedErrors);
        setIsDisable(true);
      }
    };
    validateForm();
  }, [formData]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
      <Grid container>
        <CssBaseline />

        <Grid
          item
          sm={6}
          md={6}
          lg={6}
          sx={{
            backgroundImage: `url(${LoginSide})`,
            backgroundSize: "cover",
            backgroundPosition: "cover",
            height: "100%",
            backgroundRepeat: "no-repeat",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              marginTop: "5%",
            }}
          >
            <Box className="flex flex-row justify-center items-center mb-3">
              <img src={DarkLogo} alt="" className="ml-3"></img>
              {/* <img
                src={LogoText}
                alt=""
                className="ml-3 w-[168px] h-[60px]"
              ></img> */}
              <Typography
                color={"#7398FC"}
                textAlign={"justify"}
                marginLeft={4}
                fontWeight={400}
                fontSize={26}
              >
                Feed <br /> Formulation
              </Typography>
            </Box>
            <Typography
              width={"70%"}
              color={"#7398FC"}
              mb={3}
              textAlign={"justify"}
              marginLeft={4}
              fontWeight={600}
              fontSize={20}
              className="mb-4"
            >
              Elevate Livestock Care With Our Feed Options
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          lg={6}
          component={show ? Paper : "div"}
          background={"#242449"}
          style={{
            background: "#242449",
            backgroundColor: "#242449",
            borderRadius: "0px",
          }}
        >
          <Box
            sx={{
              // mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20%",
            }}
            mx={{ xs: 4, lg: 12 }}
          >
            <Typography
              component="h1"
              variant="h4"
              fontWeight={500}
              className="w-[122px] h-[122px] flex justify-center items-center"
              style={{
                borderRadius: "80px",
                border: "1px solid #7398FC",
                background: "#161630",
              }}
            >
              <img src={Logo} alt="" />
            </Typography>
            <Typography
              component="h1"
              variant="h4"
              textAlign={"justify"}
              fontWeight={500}
              marginTop={1}
              color={"#7398FC"}
            >
              Login
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              className="w-full flex flex-col justify-center items-center"
            >
              <FormControl className="mb-3">
                <TextField
                  margin="normal"
                  required
                  style={{
                    width: "480px",
                    background: "#161630",
                    color: "white",
                  }}
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  color="success"
                  sx={{
                    marginBottom: 3,
                    color: "white",
                    "& .MuiInputBase-input": {
                      color: "white", // Text color for the input
                    },
                    "& .MuiInputLabel-root": {
                      color: "white", // Text color for the label
                    },
                    "& .MuiFormHelperText-root": {
                      color: "white", // Text color for the helper text (if any)
                    },
                    // "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                    //   {
                    //     borderColor: "ba", // Border color for the outline
                    //   },
                    // "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    //   {
                    //     borderColor: "white", // Border color for the outline when focused
                    //   },
                  }}
                  error={!!error?.email && touched?.email}
                  // helperText={touched.email ? error.email : ""}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                <FormHelperText
                  style={{
                    background: "#242449",
                    color: "red",
                    margin: "-23px 0px 0px 0px",
                  }}
                >
                  {touched.email ? error.email : ""}
                </FormHelperText>
              </FormControl>

              <FormControl>
                <TextField
                  margin="normal"
                  required
                  style={{
                    width: "480px",
                    background: "#161630",
                  }}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  color="success"
                  error={!!error?.password && touched?.password}
                  // helperText={touched?.password ? error?.password : ""}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "white", // Text color for the input
                    },
                    "& .MuiInputLabel-root": {
                      color: "white", // Text color for the label
                    },
                    "& .MuiFormHelperText-root": {
                      color: "white", // Text color for the helper text (if any)
                    },
                  }}
                />
                <FormHelperText
                  style={{
                    background: "#242449",
                    color: "red",
                    margin: "-6px 0px 0px 0px",
                  }}
                >
                  {touched.password ? error?.password : ""}
                </FormHelperText>
              </FormControl>
              <Link2
                to="/forget-password"
                className="flex justify-end w-[83%]  cursor-pointer no-underline forget mt-4"
                style={{
                  color: "white",
                }}
              >
                Forget Password?
              </Link2>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="success"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#39396A",
                  padding: "15px 0px",
                  width: "480px",
                  height: "48px",
                  color: "white",
                }}
                disabled={isDisable}
                className=""
                style={{
                  background: "#39396A",
                  color: "white",
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
