import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { fireStore, auth } from "../../Firebase/Firebase";
import { Box, Button, TextField, Checkbox } from "@mui/material";
import EditableUserData from "./editableUserData";
import StaticUserData from "./staticUserData";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useParams } from "react-router-dom";
import { storage } from "../../Firebase/Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../Components/Loader";
import { Link } from "react-router-dom";
import { FaGreaterThan } from "react-icons/fa6";
import { MdOutlineHome } from "react-icons/md";
const UserDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState({});
  const [editData, setEditData] = useState({});
  const [replicaData, setReplicaData] = useState({});
  const [imageUploadData, setImageUpload] = useState();
  const [displayImage, setdisplayImage] = useState();
  const [circlesData, setCirclesData] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]);
  const [roundsData, setRoundsData] = useState([]);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [payoutsData, setPayoutsData] = useState([]);
  const [filterCircles, setFilterCircles] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [circleColor, setCircleColor] = useState("");
  const handleSubmit = async () => {
    if (editData.username !== "" || editData.phone !== "") {
      console.log(editData);
      try {
        setDisplayLoader(true);
        const usersCollectionRef = collection(fireStore, "Users");
        const imageRef = ref(storage, `images/${id}`);

        uploadBytes(imageRef, imageUploadData)
          .then((snapshot) => {
            return getDownloadURL(snapshot.ref);
          })
          .then((url) => {
            const userDocRef = doc(usersCollectionRef, id);
            return updateDoc(userDocRef, {
              image: url,
              phone: editData.phone,
              username: editData.username,
            });
          })
          .then(() => {
            return getDoc(doc(usersCollectionRef, id));
          })
          .then((docSnapshot) => {
            const updatedData = docSnapshot.data();

            setEditData(updatedData);
            setReplicaData(updatedData);
            setEdit(false);
            setDisplayLoader(false);
          })
          .catch((error) => {
            console.error("Error updating user data:", error);
          });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    } else {
      toast.error("Username and Contact number cannot be empty.");
    }
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersCollectionRef = collection(fireStore, "Users");
        const querySnapshot = await getDocs(usersCollectionRef);
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ ...doc.data(), id: doc.id });
        });

        if (id !== null || id !== undefined || id !== "") {
          const findUser = usersData.find((item) => item.id === id);
          setUser({ ...findUser });
          setEditData({ ...findUser });
          setReplicaData({ ...findUser });

          setDisplayLoader(false);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    setDisplayLoader(true);
    fetchData();
    fetchCirclesData();
    fetchPaymentsData();
    fetchRoundsData();
    fetchPayoutsData();
  }, []);

  const changeEditComponent = () => {
    setEdit(true);
  };

  const fetchCirclesData = async () => {
    try {
      const usersCollectionRef = collection(fireStore, "Circles");
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        const circleData = { ...doc.data(), id: doc.id };

        usersData.push(circleData);
        setCirclesData(usersData);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchPaymentsData = async () => {
    try {
      const usersCollectionRef = collection(fireStore, "Payments");
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        const paymentData = { ...doc.data(), id: doc.id };
        usersData.push(paymentData);
        setPaymentsData(usersData);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchRoundsData = async () => {
    try {
      const usersCollectionRef = collection(fireStore, "Rounds");
      const querySnapshot = await getDocs(usersCollectionRef);
      const roundsData = [];
      querySnapshot.forEach((doc) => {
        const roundData = { ...doc.data(), id: doc.id };
        roundsData.push(roundData);
        setRoundsData(roundsData);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchPayoutsData = async () => {
    try {
      const usersCollectionRef = collection(fireStore, "Payouts");
      const querySnapshot = await getDocs(usersCollectionRef);
      const roundsData = [];
      querySnapshot.forEach((doc) => {
        const roundData = { ...doc.data(), id: doc.id };
        roundsData.push(roundData);
        setPayoutsData(roundsData);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  var findCircles = [];
  if (circlesData.length !== 0) {
    const findCirclesData = circlesData.filter((item) =>
      item.involvedUsers.includes(id)
    );
    if (findCirclesData?.length !== 0) {
      let circlesArray = [];
      for (let i = 0; i < findCirclesData.length; i++) {
        let paymentsCircleObj = [];

        const findRounds = roundsData.filter(
          (item) => item.circleId === findCirclesData[i]?.id
        );
        const upComingPayout = findRounds.find(
          (item) => item.recipientId === user.id
        );

        const upComingPayment = findRounds.find(
          (item) => item.paymentsDoneSum === 0
        );

        for (let j = 0; j < findRounds.length; j++) {
          const findPayment = paymentsData.find(
            (item) => item.round === findRounds[j].id && item.from_user === id
          );
          if (findPayment !== undefined) {
            paymentsCircleObj = [...paymentsCircleObj, findPayment];
          }
        }

        var contributionType = "";
        if (findCirclesData[i]?.contribType === 1) {
          contributionType = "Daily";
        } else if (findCirclesData[i]?.contribType === 2) {
          contributionType = "Weekly";
        } else if (findCirclesData[i]?.contribType === 3) {
          contributionType = "Bi-weekly";
        } else if (findCirclesData[i]?.contribType === 4) {
          contributionType = "Monthly";
        } else {
          contributionType = findCirclesData[i]?.contribType;
        }
        let circleObj = {};

        if (
          upComingPayout?.paymentsDoneSum === findCirclesData[i].totalAmount
        ) {
          circleObj = {
            ...findCirclesData[i],
            contribType: contributionType,
            payments: paymentsCircleObj,
            upComingPayout: undefined,
            upComingPayment: upComingPayment,
          };
        } else {
          circleObj = {
            ...findCirclesData[i],
            contribType: contributionType,
            payments: paymentsCircleObj,
            upComingPayout: upComingPayout,
            upComingPayment: upComingPayment,
          };
        }

        circlesArray.push(circleObj);
        findCircles = circlesArray;
      }
    }
  }

  const handleCircleStatus = (str) => {
    if (str === "active") {
      const filteredActiveCircles = findCircles.filter(
        (item) => item.statusId === 2
      );
      setFilterCircles(filteredActiveCircles);
      setCircleColor("active");
    } else {
      const filterCompletedCircles = findCircles.filter(
        (item) => item.statusId === 5
      );
      setFilterCircles(filterCompletedCircles);
      setCircleColor("past");
    }
  };

  useEffect(() => {
    console.log("data is coming");
    setExpanded(false);
  }, [filterCircles]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <div className="p-10 body-padding">
      <Box className="flex flex-col">
        <Box className="breadcrumbs flex flex-row justify-between w-[250px] mb-4 items-center">
          <Link to={"/"} className="breadcrumbs flex flex-row items-center ">
            {" "}
            <MdOutlineHome size={16} /> Home
          </Link>{" "}
          <FaGreaterThan size={14} />{" "}
          <Link to={"/users-list"} className="breadcrumbs">
            App Users
          </Link>
          <FaGreaterThan size={14} />{" "}
          <Link to={"#"} className="breadcrumbs">
            User Detail
          </Link>
        </Box>
        <h1 className="heading">Users</h1>
      </Box>
      <Toaster />
      <Box className="box-shadow">
        {displayLoader ? <Loader /> : ""}
        <Box
          className="w-full"
          style={{
            borderBottom: "1px solid #F1F1F1",
          }}
        >
          {" "}
          <h1
            className="w-50 heading"
            style={{
              color: "#3E97FF",
            }}
          >
            {edit ? "Update User Detail" : "User Detail"}
          </h1>
        </Box>
        {edit ? (
          <EditableUserData
            user={user}
            setEditData={setEditData}
            imageUpload={(event) => imageUpload(event)}
            displayImage={displayImage}
            handleSubmit={() => handleSubmit()}
            editData={editData}
            replicaData={replicaData}
          />
        ) : (
          <StaticUserData
            user={user}
            setEdit={setEdit}
            editData={editData}
            changeEditComponent={() => changeEditComponent()}
          />
        )}
        <Box className="w-full mt-4">
          <Button
            variant="outlined"
            className="dropdown font-fam-nunito"
            style={{
              background: circleColor === "active" ? "#76D0B7" : "",
              color: "black",
              fontWeight: "800",
            }}
            onClick={() => handleCircleStatus("active")}
          >
            Active Circles
          </Button>
          <Button
            variant="outlined"
            className="dropdown font-fam-nunito marginLeft"
            style={{
              color: "black",
              background: circleColor === "past" ? "#76D0B7" : "",
              fontWeight: "800",
            }}
            onClick={() => handleCircleStatus("past")}
          >
            Past Circles
          </Button>
        </Box>
        <Box className="w-full mt-3">
          <thead className="w-full flex table-style ">
            <th className="font-fam-nunito w-14">Circle ID</th>
            <th className="font-fam-nunito w-14">Circle Name</th>
            <th className="font-fam-nunito w-14">Contribution Type</th>
            <th className="font-fam-nunito w-14">Total Amount</th>
            <th className="font-fam-nunito w-14">No. of People</th>
            <th className="font-fam-nunito w-14">Start Date</th>
            <th className="font-fam-nunito w-14">End Date</th>
          </thead>

          {findCircles.length !== 0 && filterCircles.length === 0 ? (
            findCircles.map((item, index) => (
              <Accordion className="mt-4 box-sdw" key={index}>
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <tbody className="w-full flex justify-between ">
                    <td className="font-fam-nunito w-14">
                      <Typography>{item.id.substring(0, 10)}...</Typography>
                    </td>
                    <td className="font-fam-nunito w-14">
                      <Typography
                        className="text-blue-400"
                        style={{
                          textDecoration: "underline",
                        }}
                      >
                        <Link to={`/circle-dashboard/${item.id}`}>
                          {item?.name}
                        </Link>
                      </Typography>
                    </td>
                    <td className="font-fam-nunito w-14">
                      <Typography>
                        {typeof item?.contribType !== String
                          ? item?.contribType
                          : ""}
                      </Typography>
                    </td>
                    <td className="font-fam-nunito w-14">
                      <Typography>{item?.totalAmount}</Typography>
                    </td>
                    <td className="font-fam-nunito w-14">
                      <Typography>{item?.involvedUsers?.length}</Typography>
                    </td>
                    <td className="font-fam-nunito w-14">
                      <Typography>
                        {item?.startDate?.seconds
                          ? new Date(
                              item?.startDate?.seconds * 1000
                            ).toLocaleDateString()
                          : item.startDate.split(" ")[0]}
                      </Typography>
                    </td>
                    <td className="font-fam-nunito w-14">
                      <Typography>
                        {item?.updated_at?.seconds
                          ? new Date(
                              item?.updated_at?.seconds * 1000
                            ).toLocaleDateString()
                          : item.updated_at.split(" ")[0]}
                      </Typography>
                    </td>
                  </tbody>
                </AccordionSummary>
                <AccordionDetails className="accord-detail">
                  <div className="box-design p-4 bg-[#F9A45633] mb-4">
                    <h1 className="mb-1 header-head">UpComing Payout</h1>
                    {item.upComingPayout !== undefined &&
                    item.upComingPayout !== null ? (
                      <table className="w-full">
                        <thead className="w-full flex flex-row justify-between">
                          <th className="w-full flex flex-row justify-between">
                            <td className="font-fam-nunito header-head w-25 ">
                              Month
                            </td>
                            <td className="font-fam-nunito header-head  w-25 ">
                              Payment Deadline
                            </td>
                            <td className="font-fam-nunito header-head w-25 ">
                              Amount
                            </td>
                            <td className="font-fam-nunito header-head w-25">
                              Status
                            </td>
                          </th>
                        </thead>
                        <tbody className="w-full flex flex-row justify-between">
                          <tr className="w-full flex flex-row justify-between">
                            <td className="font-fam-nunito w-25">
                              {new Date(
                                item?.upComingPayout?.created_at
                              ).toLocaleString("en-us", { month: "long" })}
                            </td>
                            <td className="font-fam-nunito w-25">
                              {item?.upComingPayout?.end_date.substring(0, 10)}
                            </td>
                            <td className="font-fam-nunito w-25">
                              {item.minContrib}
                            </td>
                            <td className="  font-fam-nunito w-25">
                              <p className="unpaid-btn font-fam-nunito">
                                Unpaid
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <h1 className="header-head text-center">
                        This Circle has been Completed.
                      </h1>
                    )}
                  </div>
                  <div className="box-design p-4 bg-[#76D0B74D] mb-4">
                    <h1 className="mb-1 header-head">UpComing Payment</h1>
                    {item.upComingPayment !== undefined &&
                    item.upComingPayment !== null ? (
                      <table className="w-full ">
                        <thead className="w-full">
                          <th className="w-full flex flex-row justify-between">
                            <td className="font-fam-nunito header-head w-25">
                              Month
                            </td>
                            <td className="font-fam-nunito header-head w-25">
                              Payment Deadline
                            </td>
                            <td className="font-fam-nunito w-25 header-head">
                              Amount
                            </td>
                            <td className="font-fam-nunito w-25 header-head">
                              Status
                            </td>
                          </th>
                        </thead>
                        <tbody className="w-full flex flex-row justify-between">
                          <tr className="w-full flex flex-row justify-between">
                            <td className="font-fam-nunito w-25">
                              {new Date(
                                item?.upComingPayment?.created_at
                              ).toLocaleString("en-us", { month: "long" })}
                            </td>
                            <td className="font-fam-nunito w-25">
                              {item?.upComingPayment?.end_date.substring(0, 10)}
                            </td>
                            <td className="font-fam-nunito w-25">
                              {item.minContrib}
                            </td>
                            <td className="font-fam-nunito w-25">
                              <p className="unpaid-btn">Unpaid</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <h1 className="header-head text-center">
                        This Circle does not have any up coming payment.
                      </h1>
                    )}
                  </div>
                  <div className="box-design-dynamic p-4 bg-[#F1F4F9]">
                    <h1 className="mb-1 header-head">Previous Payments</h1>
                    {item?.payments?.length !== 0 ? (
                      <thead className="w-full flex flex-row justify-between">
                        <th className="w-full flex flex-row justify-between">
                          <td className="font-fam-nunito header-head w-25">
                            Month
                          </td>
                          <td className="font-fam-nunito header-head w-25">
                            Payment Deadline
                          </td>
                          <td className="font-fam-nunito w-25 header-head">
                            Amount
                          </td>
                          <td className="font-fam-nunito w-25 header-head">
                            Status
                          </td>
                        </th>
                      </thead>
                    ) : (
                      ""
                    )}

                    {item.payments.length !== 0 ? (
                      item.payments.map((payment) =>
                        payment !== undefined ? (
                          <>
                            <tbody className="w-full flex justify-between items-center mt-imp">
                              <td className="font-fam-nunito w-25">
                                <Typography>
                                  {payment?.created_at?.seconds
                                    ? new Date(
                                        item?.upComingPayout?.created_at
                                      ).toLocaleString("en-us", {
                                        month: "long",
                                      })
                                    : payment.created_at.split(" ")[0]}
                                </Typography>
                              </td>
                              <td className="font-fam-nunito w-25">
                                <Typography>
                                  {payment?.updated_at?.seconds
                                    ? new Date(
                                        payment?.updated_at?.seconds * 1000
                                      ).toLocaleDateString()
                                    : payment.updated_at.split(" ")[0]}
                                </Typography>
                              </td>
                              <td className="font-fam-nunito w-25">
                                <Typography>{payment.amount}</Typography>
                              </td>
                              <td className="font-fam-nunito w-25">
                                <Typography className="paid-btn">
                                  Paid
                                </Typography>
                              </td>
                            </tbody>
                          </>
                        ) : (
                          ""
                        )
                      )
                    ) : (
                      <h1 className="header-head text-center">
                        There is not payment has been made yet!
                      </h1>
                    )}
                  </div>
                </AccordionDetails>
              </Accordion>
            ))
          ) : filterCircles.length !== 0 ? (
            filterCircles.map((item, index) => (
              <Accordion
                className="mt-4 box-sdw"
                key={index}
                expanded={expanded === index}
                onChange={handleAccordionChange(index)}
              >
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <tbody className="w-full flex justify-between ">
                    <td className="font-fam-nunito w-14">
                      <Typography>{item.id.substring(0, 10)}...</Typography>
                    </td>
                    <td
                      className="font-fam-nunito w-14  text-blue-400"
                      style={{
                        textDecoration: "underline",
                      }}
                    >
                      <Link to={`/circle-dashboard/${item.id}`}>
                        <Typography>{item?.name}</Typography>
                      </Link>
                    </td>
                    <td className="font-fam-nunito w-14">
                      <Typography>
                        {typeof item?.contribType !== String
                          ? item?.contribType
                          : ""}
                      </Typography>
                    </td>
                    <td className="font-fam-nunito w-14">
                      <Typography>{item?.totalAmount}</Typography>
                    </td>
                    <td className="font-fam-nunito w-14">
                      <Typography>{item?.involvedUsers?.length}</Typography>
                    </td>
                    <td className="font-fam-nunito w-14">
                      <Typography>
                        {item?.startDate?.seconds
                          ? new Date(
                              item?.startDate?.seconds * 1000
                            ).toLocaleDateString()
                          : item.startDate.split(" ")[0]}
                      </Typography>
                    </td>
                    <td className="font-fam-nunito w-14">
                      <Typography>
                        {item?.updated_at?.seconds
                          ? new Date(
                              item?.updated_at?.seconds * 1000
                            ).toLocaleDateString()
                          : item.updated_at.split(" ")[0]}
                      </Typography>
                    </td>
                  </tbody>
                </AccordionSummary>
                <AccordionDetails className="accord-detail">
                  <div className="box-design p-4 bg-[#F9A45633] mb-4">
                    <h1 className="mb-1 header-head">UpComing Payout</h1>
                    {item.upComingPayout !== undefined &&
                    item.upComingPayout !== null ? (
                      <table className="w-full">
                        <thead className="w-full flex flex-row justify-between ">
                          <th className="w-full flex flex-row justify-between">
                            <td className="font-fam-nunito header-head w-25 ">
                              Month
                            </td>
                            <td className="font-fam-nunito header-head  w-25 ">
                              Payment Deadline
                            </td>
                            <td className="font-fam-nunito header-head w-25 ">
                              Amount
                            </td>
                            <td className="font-fam-nunito header-head w-25">
                              Status
                            </td>
                          </th>
                        </thead>
                        <tbody className="w-full flex flex-row justify-between">
                          <tr className="w-full flex flex-row justify-between">
                            <td className="font-fam-nunito w-25">
                              {new Date(
                                item?.upComingPayout?.created_at
                              ).toLocaleString("en-us", { month: "long" })}
                            </td>
                            <td className="font-fam-nunito w-25">
                              {item?.upComingPayout?.end_date.substring(0, 10)}
                            </td>
                            <td className="font-fam-nunito w-25">
                              {item.minContrib}
                            </td>
                            <td className="  font-fam-nunito w-25">
                              <p className="unpaid-btn font-fam-nunito">
                                Unpaid
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <h1 className="header-head text-center">
                        This Circle has been Completed.
                      </h1>
                    )}
                  </div>
                  <div className="box-design p-4 bg-[#76D0B74D] mb-4">
                    <h1 className="mb-1 header-head">UpComing Payment</h1>
                    {item.upComingPayment !== undefined &&
                    item.upComingPayment !== null ? (
                      <table className="w-full ">
                        <thead className="w-full">
                          <th className="w-full flex flex-row justify-between items-center">
                            <td className="font-fam-nunito header-head w-25 text-center">
                              Month
                            </td>
                            <td className="font-fam-nunito header-head w-25 text-center">
                              Payment Deadline
                            </td>
                            <td className="font-fam-nunito w-25 header-head text-center">
                              Amount
                            </td>
                            <td className="font-fam-nunito w-25 header-head text-center">
                              Status
                            </td>
                          </th>
                        </thead>
                        <tbody className="w-full flex flex-row justify-between items-center">
                          <tr className="w-full flex flex-row justify-between items-center">
                            <td className="font-fam-nunito w-25">
                              {new Date(
                                item?.upComingPayment?.created_at
                              ).toLocaleString("en-us", { month: "long" })}
                            </td>
                            <td className="font-fam-nunito w-25">
                              {item?.upComingPayment?.end_date.substring(0, 10)}
                            </td>
                            <td className="font-fam-nunito w-25">
                              {item.minContrib}
                            </td>
                            <td className="font-fam-nunito w-25">
                              <p className="unpaid-btn">Unpaid</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <h1 className="header-head text-center">
                        This Circle does not have any up coming payment.
                      </h1>
                    )}
                  </div>
                  <div className="box-design-dynamic p-4 bg-[#F1F4F9]">
                    <h1 className="mb-1 header-head">Previous Payments</h1>
                    {item?.payments?.length !== 0 ? (
                      <thead className="w-full flex flex-row justify-between">
                        <th className="w-full flex flex-row justify-between">
                          <td className="font-fam-nunito header-head w-25">
                            Month
                          </td>
                          <td className="font-fam-nunito header-head w-25">
                            Payment Deadline
                          </td>
                          <td className="font-fam-nunito w-25 header-head">
                            Amount
                          </td>
                          <td className="font-fam-nunito w-25 header-head">
                            Status
                          </td>
                        </th>
                      </thead>
                    ) : (
                      ""
                    )}

                    {item.payments.length !== 0 ? (
                      item.payments.map((payment) =>
                        payment !== undefined ? (
                          <tbody className="w-full flex justify-between items-center  mt-imp">
                            <td className="font-fam-nunito w-25 ">
                              <Typography>
                                {payment?.created_at?.seconds
                                  ? new Date(
                                      item?.upComingPayout?.created_at
                                    ).toLocaleString("en-us", {
                                      month: "long",
                                    })
                                  : payment.created_at.split(" ")[0]}
                              </Typography>
                            </td>
                            <td className="font-fam-nunito w-25">
                              <Typography>
                                {payment?.updated_at?.seconds
                                  ? new Date(
                                      payment?.updated_at?.seconds * 1000
                                    ).toLocaleDateString()
                                  : payment.updated_at.split(" ")[0]}
                              </Typography>
                            </td>
                            <td className="font-fam-nunito w-25">
                              <Typography>{payment.amount}</Typography>
                            </td>
                            <td className="font-fam-nunito w-25">
                              <Typography className="paid-btn">Paid</Typography>
                            </td>
                          </tbody>
                        ) : (
                          ""
                        )
                      )
                    ) : (
                      <h1 className="header-head text-center">
                        There is not payment has been made yet!
                      </h1>
                    )}
                  </div>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Box>
              <Typography>
                This user does not involved in any circle!
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default UserDetail;
