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
} from "firebase/firestore";
import { fireStore, auth } from "../../Firebase/Firebase";
import Loader from "../../Components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { CgAddR } from "react-icons/cg";
import emailjs from "@emailjs/browser";
import { createUserWithEmailAndPassword } from "firebase/auth";
const OrganisePeople = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [circlesData, setCirclesData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [invitePeopleForm, setInvitePeopleForm] = useState(false);
  const [members, setMembers] = useState([
    {
      username: "",
      email: "",
      phone: "",
      password: "GolakUser123456",
      fcmToken: "",
      id: "",
      image: "",
      playerId: "",
      country: "",
      statusId: 4,
      statusLabel: "Unregistered",
      facilitator: false,
    },
  ]);
  useEffect(() => {
    fetchCirclesData();
    fetchUsersData();
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

  const handleAddMember = () => {
    setMembers([
      ...members,
      {
        username: "",
        email: "",
        phone: "",
        password: "GolakUser123456",
        fcmToken: "",
        id: "",
        image: "",
        playerId: "",
        country: "",
        statusId: 4,
        statusLabel: "Unregistered",
        facilitator: false,
      },
    ]);
  };

  const stringNumber = 100;
  const number = parseInt(stringNumber, 10);
  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];

    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  var existingUsers;
  var findCircle = {};
  if (circlesData.length !== 0 && usersData.length !== 0) {
    findCircle = circlesData.find((item) => item.id === id);

    existingUsers = usersData.filter((userId) =>
      findCircle.involvedUsers?.includes(userId.id)
    );
  }
  const columnDefs = useMemo(
    () => [
      {
        headerName: "User ID",
        field: "id",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "User Name",
        field: "username",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => {
          const userData = params.data.username;

          return <Link to={`/user-detail/${params.data.id}`}>{userData}</Link>;
        },
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
        headerName: "Email",
        field: "email",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "Status",
        field: "statusLabel",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
    ],
    [circlesData]
  );

  const handleInvite = () => {
    if (
      findCircle?.currentRound?.rankNumber === 1 &&
      findCircle?.currentRound?.paymentsDoneSum === 0
    ) {
      setInvitePeopleForm(true);
    } else {
      toast.error(
        "You cannot invite more people to this circle because the first payment has already been made. Thank you, and enjoy managing your circle payments."
      );
    }
  };

  const usersDataEntry = async (results) => {
    for (const userData of members) {
      try {
        const userExists = await checkUserExists(userData.email);
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

  const handleUpdate = async () => {
    setDisplayLoader(true);
    const isValidEmails = members.every((member) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(member.email);
    });

    if (!isValidEmails) {
      toast.error("Please enter valid email addresses for all members.");
      return;
    }
    const results = [];
    const latestRound = await findLatestRound(findCircle.id);
    const sortedRounds = latestRound.sort(
      (a, b) => b.rankNumber - a.rankNumber
    );

    const highestRankRound = sortedRounds[0];

    const data = await usersDataEntry(results);
    if (findCircle) {
      const idsArray = data.map((user) => user.id);
      const arrayForUsersIds = [...findCircle.involvedUsers, ...idsArray];
      const usersCollectionRef = collection(fireStore, "Circles");
      const userDocRef = doc(usersCollectionRef, findCircle.id);
      updateDoc(userDocRef, {
        involvedUsers: [...arrayForUsersIds],
      });

      roundCreation(findCircle, idsArray, highestRankRound);
      setDisplayLoader(false);
    }
  };

  const findLatestRound = async (id) => {
    try {
      const usersCollectionRef = collection(fireStore, "Rounds");
      const q = query(usersCollectionRef, where("circleId", "==", id));
      const querySnapshot = await getDocs(q);

      const roundsData = [];
      querySnapshot.forEach((doc) => {
        const roundData = { ...doc.data(), id: doc.id };
        roundsData.push(roundData);
      });

      if (roundsData.length > 0) {
        return roundsData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
      throw error;
    }
  };
  const roundCreation = (circle, idsArray, latestRound) => {
    var rank = latestRound.rankNumber;

    if (circle.contribType === 4) {
      var current = new Date(latestRound.end_date);
      for (let i = 0; i < idsArray?.length; i++) {
        rank = rank + 1;
        const weeklyDateRange = getDateRange("monthly", current);
        roundsAdd(rank, circle, weeklyDateRange, idsArray[i]);
        current = weeklyDateRange.currentDate;
      }
    } else if (circle.contribType === 2) {
      var current = new Date(latestRound.end_date);
      for (let i = 0; i < idsArray?.length; i++) {
        const weeklyDateRange = getDateRange("weekly", current);
        rank = rank + 1;
        roundsAdd(rank, circle, weeklyDateRange, idsArray[i]);
        current = weeklyDateRange.currentDate;
      }
    } else if (circle.contribType === 1) {
      var current = new Date(latestRound.end_date);
      for (let i = 0; i < idsArray?.length; i++) {
        const weeklyDateRange = getDateRange("daily", current);
        rank = rank + 1;
        roundsAdd(rank, circle, weeklyDateRange, idsArray[i]);
        current = weeklyDateRange.currentDate;
      }
    }
  };

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
    const CirclesCollectionRef = collection(fireStore, "Circles");
    const circleDocRef = doc(CirclesCollectionRef, circle?.id);
    const circleDocSnap = await getDoc(circleDocRef);
    findCircle = { ...circleDocSnap.data(), id: circleDocSnap.id };
    setInvitePeopleForm(false);
    setMembers([
      {
        username: "",
        email: "",
        phone: "",
        password: "GolakUser123456",
        fcmToken: "",
        id: "",
        image: "",
        playerId: "",
        country: "",
        statusId: 4,
        statusLabel: "Unregistered",
        facilitator: false,
      },
    ]);
  };

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

  const handleNavigation = () => {
    if (findCircle?.statusId === 2) {
      navigate(`/organise-circle-payment/${id}`);
    } else {
      toast.error(
        "This Circle has not been approved yet. Please approved it first and then you can organise the payments of this circle!",
        {
          className: "toast-center",
        }
      );
    }
  };
  console.log(findCircle, "circlesData");

  return (
    <div className="p-10 body-padding">
      <Box className="flex flex-row justify-between mb-4">
        {displayLoader ? <Loader /> : ""}
        <Toaster />
        <h1 className="heading">Invite People</h1>

        <Box>
          {findCircle?.statusId !== 5 ? (
            <Button
              className="dropdown mr-3"
              variant="contained"
              onClick={() => handleNavigation()}
            >
              Organise People
            </Button>
          ) : (
            ""
          )}

          <Button
            className="dropdown"
            variant="contained"
            onClick={() => handleInvite()}
          >
            Invite People
          </Button>
        </Box>
      </Box>
      <Box className="box-shadow">
        {!invitePeopleForm ? (
          <DataTable columnDefs={columnDefs} rowData={existingUsers} />
        ) : (
          <Box className="mt-4 p-2 flex flex-col w-full justify-between">
            <Box className="flex flex-row w-full justify-center mb-3">
              <Button
                className="dropdown w-[30%] mt-4  "
                style={{
                  color: "#4379EE",
                  border: "1px solid #4379EE",
                  padding: "12px 0px",
                }}
                disabled={number === members.length}
                onClick={handleAddMember}
              >
                {" "}
                <CgAddR size={20} className="mr-2" />
                Add New Member
              </Button>
            </Box>
            {members.map((member, index) => (
              <div key={index} className="card">
                <Box className="flex flex-row justify-between">
                  <Box className="w-full flex flex-col">
                    <label className="label">Name</label>
                    <TextField
                      required
                      className="bgd-input"
                      placeholder="Enter Member Name"
                      value={member.username}
                      onChange={(e) =>
                        handleMemberChange(index, "username", e.target.value)
                      }
                    />
                  </Box>
                </Box>
                <Box className="flex flex-row justify-between mt-4">
                  <Box className="w-full flex flex-col ">
                    <label className="label">Email</label>
                    <TextField
                      required
                      className="bgd-input"
                      placeholder="Enter Email ID"
                      value={member.email}
                      onChange={(e) =>
                        handleMemberChange(index, "email", e.target.value)
                      }
                    />
                  </Box>
                </Box>
                <Box className="flex flex-row justify-between mt-4">
                  <Box className="w-full flex flex-col ">
                    <label className="label">Phone Number</label>
                    <TextField
                      required
                      className="bgd-input"
                      placeholder="Enter Phone Number"
                      value={member.phone}
                      type="number"
                      onChange={(e) =>
                        handleMemberChange(index, "phone", e.target.value)
                      }
                    />
                  </Box>
                </Box>
              </div>
            ))}
            <Box>
              <Button
                variant="contained"
                className="mt-4 w-full"
                onClick={handleUpdate}
              >
                Add Users in Circle
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default OrganisePeople;
