import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import CreationStep1 from "./creationStep1";
import CreationStep2 from "./creationStep2";
import CreationStep3 from "./creationStep3";
import { firebaseApp, fireStore, auth } from "../../Firebase/Firebase";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import Loader from "../../Components/Loader";
import { Link } from "react-router-dom";
import { FaGreaterThan } from "react-icons/fa6";
import { MdOutlineHome } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";

const steps = ["Add New Circle", "Invite People", "Organise People"];
export default function CreateCircle() {
  const navigate = useNavigate();
  const [displayLoader, setDisplayLoader] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [usersData, setUsersData] = React.useState([]);
  const [skipped, setSkipped] = React.useState(new Set());
  const [members, setMembers] = React.useState([
    {
      username: "",
      email: "",
      phone: "",
      password: "GolakUser123456",
      fcmToken: "",
      id: "",
      image: "",
      ispay: false,
      playerId: "",
      country: "",
      statusId: 4,
      statusLabel: "Unregistered",
      facilitator: false,
    },
  ]);

  const [errors, setErrors] = React.useState({
    name: "",
    minContrib: "",
    totalAmount: "",
    numUsers: "",
    startDate: "",
    slot: "",
  });

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setDisplayLoader(true);
    try {
      const usersCollectionRef = collection(fireStore, "Users");
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ ...doc.data(), id: doc.id });
        const usersFilter = usersData.filter((item) => item.statusId !== 4);
        setUsersData(usersFilter);
        setDisplayLoader(false);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");
  const milliseconds = String(currentDate.getMilliseconds())
    .padStart(3, "0")
    .padEnd(6, "0");

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

  function formattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const milliseconds = String(date.getMilliseconds())
      .padStart(3, "0")
      .padEnd(6, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  function getDateRange(frequency, currentDate) {
    switch (frequency) {
      case "weekly":
        const nextWeekDate = new Date(currentDate);
        nextWeekDate.setDate(currentDate.getDate() + 7);
        return {
          startDate: formattedDate(currentDate),
          endDate: formattedDate(nextWeekDate),
          currentDate: nextWeekDate,
        };
      case "monthly":
        const nextMonthDate = new Date(currentDate);
        nextMonthDate.setMonth(currentDate.getMonth() + 1);
        return {
          startDate: formattedDate(currentDate),
          endDate: formattedDate(nextMonthDate),
          currentDate: nextMonthDate,
        };
      case "daily":
        const nextDate = new Date(currentDate);
        nextDate.setMonth(currentDate.getDate() + 1);
        return {
          startDate: formattedDate(currentDate),
          endDate: formattedDate(nextDate),
          currentDate: nextDate,
        };

      default:
        return null;
    }
  }

  const [step1Data, setStep1Data] = React.useState({
    name: "",
    contribType: 0,
    created_at: "",
    numUsers: 3,
    startDate: "",
    totalAmount: 0,
    updated_at: "",
    minContrib: 0,
    involvedUsers: [],
    circleUsers: [],
    slot: "",
  });

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    if (activeStep === 1) {
      const isValidEmails = members.every((member) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(member.email);
      });

      if (!isValidEmails) {
        toast.error("Please enter valid email addresses for all members.");
        return;
      }

      if (members.length === step1Data.numUsers) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        toast.error(`Please enter the details of ${step1Data.numUsers} users.`);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    setDisplayLoader(true);
    const results = [];
    const data = await usersDataEntry(results);
    try {
      // if (data.length >= 0) {
      const idsArray = data.map((user) => user.id);
      const findIndex = members?.findIndex((item) => item.facilitator === true);
      if (members[findIndex] !== undefined) {
        const usersCollectionRef = collection(fireStore, "Circles");
        const circleData = await addDoc(usersCollectionRef, {
          ...step1Data,
          created_at: formattedDateTime,
          startDate: formattedDateTime,
          updated_at: formattedDateTime,
          circleUsers: [...data],
          involvedUsers: [...idsArray],
          statusId: 1,
          statusLabel: "Pending",
          currentRound: {},
          createdById: data[findIndex].id,
          currentRoundId: "",
        });
        const circleId = circleData.id;
        const circleDocRef = doc(usersCollectionRef, circleId);
        const circleDocSnap = await getDoc(circleDocRef);
        const userInfo = roundCreation({
          ...circleDocSnap.data(),
          id: circleData?.id,
        });
        setTimeout(() => {
          if (userInfo === "through") {
            navigate(`/circle-dashboard/${circleData?.id}`);
          }
        }, 800);
      } else {
        toast.error("Please add facilitator for manage your circle payments!");
      }

      setDisplayLoader(false);
      // }
    } catch (err) {
      console.log(err, "error is coming");
      toast.error(
        "There is some error creating your circle. Please try again later."
      );
      setDisplayLoader(false);
    }
  };

  const roundCreation = (circle) => {
    if (circle.contribType === 4) {
      var current = new Date();
      for (let i = 0; i < circle?.involvedUsers?.length; i++) {
        const weeklyDateRange = getDateRange("monthly", current);
        const index = i + 1;
        roundsAdd(index, circle, weeklyDateRange, circle.involvedUsers[i]);
        current = weeklyDateRange.currentDate;
      }
    } else if (circle.contribType === 2) {
      var current = new Date();
      for (let i = 0; i < circle?.involvedUsers?.length; i++) {
        const weeklyDateRange = getDateRange("weekly", current);
        const index = i + 1;
        roundsAdd(index, circle, weeklyDateRange, circle.involvedUsers[i]);
        current = weeklyDateRange.currentDate;
      }
    } else if (circle.contribType === 1) {
      var current = new Date();
      for (let i = 0; i < circle?.involvedUsers?.length; i++) {
        const weeklyDateRange = getDateRange("daily", current);
        const index = i + 1;
        roundsAdd(index, circle, weeklyDateRange, circle.involvedUsers[i]);
        current = weeklyDateRange.currentDate;
      }
    }

    return "through";
  };

  const roundsAdd = async (ind, circle, dateRange, userId) => {
    const usersCollectionRef = collection(fireStore, "Rounds");

    const roundData = await addDoc(usersCollectionRef, {
      circleId: circle.id,
      created_at: dateRange.startDate,
      start_date: dateRange.startDate,
      updated_at: dateRange.startDate,
      end_date: dateRange.endDate,
      paymentsDoneSum: 0,
      rankNumber: ind,
      recipientId: userId,
    });

    const roundId = roundData.id;
    const roundDocRef = doc(usersCollectionRef, roundId);
    const roundDocSnap = await getDoc(roundDocRef);
    const round = roundDocSnap.data();
    if (round.rankNumber === 1) {
      const usersCollectionRef = collection(fireStore, "Circles");
      const userDocRef = doc(usersCollectionRef, circle.id);
      updateDoc(userDocRef, {
        currentRound: { ...round, id: roundDocSnap.id },
        currentRoundId: roundDocSnap.id,
      });
    }
  };
  const usersDataEntry = async (results) => {
    for (const userData of members) {
      try {
        const userExists = await checkUserExists(userData.email.toLowerCase());
        if (!userExists) {
          emailjs.send(
            "service_ege6h0u",
            "template_xc0c3wz",
            {
              from_name: "Golak",
              to_name: `${userData.username}`,
              message:
                "You have been invited to the new Circle. Please Sign In and make your payments on time",
              email: `${userData.email}`,
            },
            {
              publicKey: "NjVoOMCv8ZqG7d5aa",
            }
          );
          await createUserWithEmailAndPassword(
            auth,
            userData.email,
            "GolakUser123456"
          );
          const usersCollectionRef = collection(fireStore, "Users");
          const data = await addDoc(usersCollectionRef, {
            ...userData,
          });
          const docId = data.id;

          results.push({ ...userData, id: docId });
        } else {
          results.push({ ...userExists });
        }
      } catch (err) {
        console.error("Error handling user:", err);
        results.push({
          email: userData.email,
          added: false,
          error: err.message,
        });
      }
    }
    return results;
  };

  const checkUserExists = async (email) => {
    try {
      const usersCollectionRef = collection(fireStore, "Users");
      const q = query(usersCollectionRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const obj = {
          ...querySnapshot.docs[0].data(),
          id: querySnapshot.docs[0].id,
          isPay: false,
        };

        return obj;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
      throw error;
    }
  };
  return (
    <div className="p-10 body-padding">
      <Box className="flex flex-col">
        <Box className="breadcrumbs flex flex-row justify-between w-[170px] mb-4 items-center">
          <Toaster />
          <Link to={"/"} className="breadcrumbs flex flex-row items-center">
            {" "}
            <MdOutlineHome size={16} /> Home
          </Link>{" "}
          <FaGreaterThan size={14} />{" "}
          <Link to={"#"} className="breadcrumbs">
            Create Circle
          </Link>
        </Box>
        <h1 className="heading">Add New Circle</h1>
      </Box>

      <Box
        className=" box-shadow "
        style={{
          padding: "80px",
          paddingLeft: "20%",
          paddingRight: "20%",
        }}
      >
        {displayLoader ? <Loader /> : ""}
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};

            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps} className="flex flex-col-reverse">
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <React.Fragment>
          {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
          {activeStep === 0 ? (
            <CreationStep1
              setStep1Data={setStep1Data}
              step1Data={step1Data}
              errors={errors}
              setErrors={setErrors}
            />
          ) : null}
          {activeStep === 1 ? (
            <CreationStep2
              setStep1Data={setStep1Data}
              step1Data={step1Data}
              setMembers={setMembers}
              members={members}
            />
          ) : null}
          {activeStep === 2 ? (
            <CreationStep3
              setMembers={setMembers}
              members={members}
              step1Data={step1Data}
            />
          ) : null}
          <Box></Box>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
              className="dropdown"
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />

            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                variant="contained"
                className="dropdown"
                style={{
                  background: "#4880FF",
                  padding: "8px 30px",
                  borderRadius: "10px",
                  color: "white",
                }}
              >
                {"Submit"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                className="dropdown"
                disabled={
                  step1Data.name === "" ||
                  step1Data.minContrib === "" ||
                  step1Data.contribType === "" ||
                  step1Data.totalAmount === "" ||
                  step1Data.numUsers === "" ||
                  step1Data.startDate === "" ||
                  step1Data.slot === ""
                }
                style={{
                  background: "#4880FF",
                  padding: "8px 30px",
                  borderRadius: "10px",
                  color: "white",
                }}
              >
                {"Next"}
              </Button>
            )}
          </Box>
        </React.Fragment>
      </Box>
    </div>
  );
}
