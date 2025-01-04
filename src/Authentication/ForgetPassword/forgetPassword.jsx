import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Link as Link2 } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import LoginSide from "../../Assets/Images/LoginSide.png";
import DarkLogo from "../../Assets/Images/loginLogo.png";
import Logo from "../../Assets/Images/loginLogo.png";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { firebaseApp } from "../../Firebase/Firebase";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ForgetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(true);
  const [severity, setSeverity] = useState("success");
  const [error, setErrors] = useState({});
  const [isDisable, setIsDisable] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    // password: "",
  });
  // const [loading, setLoding] = useState(true);
  const [touched, setTouched] = useState({
    email: false,
    // password: false,
  });

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("You must enter a valid email")
      .required("You must enter an email")
      .test("valid-email", "Invalid email format", (value) => {
        return yup.string().email().isValidSync(value);
      }),
    // password: yup
    //   .string()
    //   .min(8, "Password is too short - must be at least 8 characters.")
    //   .required("Please enter your password."),
  });

  const handleBlur = (e) => {
    const { name } = e?.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const auth = getAuth(firebaseApp);
      await sendPasswordResetEmail(auth, formData.email)
        .then((res) => {
          toast.success("Email has been sent to your gmail account.");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        })
        .catch((error) => {
          toast.error("Email is invalid!");
        });
    } catch (err) {
      console.log(err, "data is coming");
    }
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
      <Toaster />
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
            height: "auto",
            backgroundRepeat: "no-repeat",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              marginTop: "5%",
            }}
          >
            <img src={DarkLogo} alt="" className="ml-3"></img>

            <Typography
              width={"70%"}
              color={"white"}
              mb={3}
              textAlign={"justify"}
              marginLeft={4}
              fontWeight={600}
              fontSize={20}
              className="mb-4"
            >
              Digitizing Ancient Money Circles
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
            <Typography component="h1" variant="h4" fontWeight={500}>
              <img src={Logo} alt="" />
            </Typography>
            <Typography
              component="h1"
              variant="h4"
              textAlign={"justify"}
              fontWeight={500}
              marginTop={1}
            >
              Forget Password
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{}}
              className="w-full"
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                color="success"
                sx={{ marginBottom: 3 }}
                error={!!error?.email && touched?.email}
                helperText={touched.email ? error.email : ""}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />

              {/* <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  /> */}

              <Link2
                to="/login"
                className="flex justify-end cursor-pointer no-underline forget"
              >
                Want to Login?
              </Link2>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="dropdown"
                color="success"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#76D0B7",
                  padding: "15px 0px",
                }}
                disabled={isDisable}
              >
                Send Email address
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
