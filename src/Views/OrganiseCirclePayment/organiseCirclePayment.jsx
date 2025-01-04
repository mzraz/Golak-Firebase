import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";
import DataTable from "../../Components/DataGrid";
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
import { fireStore } from "../../Firebase/Firebase";
import Loader from "../../Components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { RiDeleteBin5Fill } from "react-icons/ri";
const OrganiseCirclePayments = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [circlesData, setCirclesData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const ITEM_HEIGHT = 48;
  const [displayLoader, setDisplayLoader] = useState(false);
  const [circleData, setCircleData] = useState();
  const [propUserData, setPropData] = useState({});
  const [usersExistInCircle, setUsersExistInCircle] = useState([]);
  var updatedUsers = [];
  const open = Boolean(anchorEl);
  const handleClick = (event, userData) => {
    setAnchorEl(event.currentTarget);
    setPropData(userData);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [paymentData, setPaymentsData] = useState([]);
  useEffect(() => {
    fetchCirclesData();
    fetchUsersData();
    fetchPaymentsData();
  }, []);
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

  const fetchUsersData = async () => {
    setDisplayLoader(true);
    try {
      const usersCollectionRef = collection(fireStore, "Users");
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        const circleData = { ...doc.data(), id: doc.id };

        usersData.push(circleData);
        setUsersData(usersData);
        setDisplayLoader(false);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchPaymentsData = async () => {
    setDisplayLoader(true);
    try {
      const usersCollectionRef = collection(fireStore, "Payments");
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        const circleData = { ...doc.data(), id: doc.id };

        usersData.push(circleData);
        setPaymentsData(usersData);
        setDisplayLoader(false);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    if (circlesData.length !== 0 && usersData?.length !== 0) {
      let findCircle = circlesData?.find((item) => item.id === id);
      setCircleData(findCircle);
      let existingUsers = usersData?.filter((userId) =>
        findCircle?.involvedUsers?.includes(userId.id)
      );
      let usersArray = [];
      const payments = paymentData.filter(
        (item) => item.round === findCircle?.currentRoundId
      );

      for (let i = 0; i < existingUsers?.length; i++) {
        const findPayment = payments.find(
          (item) => item.from_user === existingUsers[i]?.id
        );

        if (findPayment !== undefined) {
          existingUsers[i] = {
            ...existingUsers[i],
            payment: findPayment.amount,
            isAlreadyPaid: true,
          };
        } else {
          existingUsers[i] = {
            ...existingUsers[i],
            payment: 0,
            isAlreadyPaid: false,
          };
        }
      }

      setUsersExistInCircle(existingUsers);
      updatedUsers = [...existingUsers];
    }
  }, [circlesData, usersData, paymentData]);

  const columnDefs = useMemo(() => {
    if (!circleData) return [];

    return [
      {
        headerName: "User ID",
        field: "id",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },

      {
        headerName: "Name",
        field: "username",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "Email",
        field: "email",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "Phone Number",
        field: "phone",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "Facilitator",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => {
          let facilitator = false;
          if (params?.data?.id === circleData?.createdById) {
            facilitator = true;
          }

          return (
            <td>
              <input
                type="checkbox"
                style={{ width: "20px", height: "20px" }}
                checked={facilitator}
                name="facilitator"
              />
            </td>
          );
        },
      },

      {
        headerName: "Actions",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => (
          <td className="flex flex-row justify-center items-center">
            <label className="switch flex flex-row justify-end items-center">
              <input
                type="checkbox"
                checked={params.data.payment !== 0}
                disabled={params.data.isAlreadyPaid === true}
                onChange={(event) =>
                  handleStatusUpdate(event, params.data, params.node.rowIndex)
                }
              />
              <span
                className={`slider round w-[95px] slider-text ${
                  params.data.payment !== 0
                    ? "flex flex-row justify-start items-center pl-3"
                    : "flex flex-row justify-end items-center pr-2"
                }`}
              >
                {params.data.payment !== 0 ? "Paid" : "Unpaid"}
              </span>
            </label>

            <IconButton
              aria-label="more"
              id="long-button"
              className="dropdown ml-3"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={(event) => handleClick(event)}
            >
              <MoreVertIcon />
            </IconButton>
          </td>
        ),
      },
    ];
  }, [usersExistInCircle]);

  const handleSubmit = async () => {
    setDisplayLoader(true);
    let paymentsSum = 0;
    for (let i = 0; i < usersExistInCircle.length; i++) {
      if (
        usersExistInCircle[i].isAlreadyPaid === false &&
        usersExistInCircle[i].payment !== 0
      ) {
        let obj = {
          amount: usersExistInCircle[i].payment,
          created_at: serverTimestamp(),
          from_user: usersExistInCircle[i]?.id,
          round: circleData?.currentRoundId,
          updated_at: serverTimestamp(),
        };
        const paymentsCollectionRef = collection(fireStore, "Payments");
        await addDoc(paymentsCollectionRef, obj);
        paymentsSum = obj?.amount + paymentsSum;
      }
    }

    if (paymentsSum !== 0) {
      try {
        const usersCollectionRef = collection(fireStore, "Rounds");
        const userDocRef = doc(usersCollectionRef, circleData?.currentRoundId);
        await updateDoc(userDocRef, {
          paymentsDoneSum:
            circleData?.currentRound?.paymentsDoneSum + paymentsSum,
        });

        const RoundCollectionRef = collection(fireStore, "Circles");
        const roundDocRef = doc(RoundCollectionRef, circleData?.id);
        await updateDoc(roundDocRef, {
          currentRound: {
            circleId: circleData.currentRound.circleId,
            created_at: circleData.currentRound.created_at,
            end_date: circleData.currentRound.end_date,
            paymentsDoneSum:
              circleData?.currentRound?.paymentsDoneSum + paymentsSum,
            rankNumber: circleData.currentRound.rankNumber,
            recipientId: circleData.currentRound.recipientId,
            start_date: circleData.currentRound.start_date,
            updated_at: circleData.currentRound.updated_at,
            id: circleData.currentRound.id,
          },
        });
        toast.success("Circle payments have been paid.");
        setDisplayLoader(false);
        navigate(`/organise-circle/${id}`);
      } catch (error) {
        console.log(error);
        toast.error("There is some issue updating your circle payments!");
      }
    }
    setDisplayLoader(false);
  };

  const handleStatusUpdate = (event, data, index) => {
    const updatedUsersExistInCircle = [...usersExistInCircle];

    updatedUsersExistInCircle[index] = {
      ...updatedUsersExistInCircle[index],
      payment: event.target.checked ? parseInt(circleData.minContrib) : 0,
    };

    setUsersExistInCircle(updatedUsersExistInCircle);
  };
  return (
    <div className="p-10 body-padding">
      <Box className="flex flex-row justify-between mb-4">
        {displayLoader ? <Loader /> : ""}
        <Toaster />
        <h1 className="heading">Organise People</h1>
        <h2>Total Members : {usersExistInCircle.length}</h2>
      </Box>
      <Box className="box-shadow">
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          }}
        >
          <MenuItem className="ml-2">
            <RiDeleteBin5Fill size={20} color="red" className="mr-2" />
            Delete User
          </MenuItem>
        </Menu>
        <DataTable columnDefs={columnDefs} rowData={usersExistInCircle} />
      </Box>
      <Box className="flex flex-row w-full justify-end mt-4">
        <Button
          variant="contained"
          className="dropdown"
          style={{
            width: "138px",
          }}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </Box>
    </div>
  );
};

export default OrganiseCirclePayments;
