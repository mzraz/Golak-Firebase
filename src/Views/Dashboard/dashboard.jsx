import { Box, Button } from "@mui/material";
import activeUsers from "../../Assets/Images/activeUsers.png";
import totalPayments from "../../Assets/Images/totalPayments.png";
import totalPayouts from "../../Assets/Images/totalpayouts.png";
import amountCollected from "../../Assets/Images/amountcollected.png";
import Chart from "react-apexcharts";
import DataTable from "../../Components/DataGrid";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { fireStore, auth, firebaseApp } from "../../Firebase/Firebase";
import SearchBar from "../../Components/SearchBar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
const Dashboard = () => {
  const [usersData, setUsersData] = useState([]);
  const [circlesData, setCirclesData] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]);
  const [roundsData, setRoundsData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [filteredCircles, setFilteredCircles] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [payoutsData, setPayoutsData] = useState(0);
  useEffect(() => {
    setDisplayLoader(true);
    fetchUsersData();
    fetchPaymentsData();
    fetchCirclesData();
    fetchRoundsData();
    fetchPayoutsData();
  }, []);

  useEffect(() => {
    if (
      paymentsData.length !== 0 &&
      circlesData.length !== 0 &&
      roundsData.length !== 0
    ) {
      let calculatedAmount = 0;
      paymentsData.forEach((paymentData) => {
        const findRoundData = roundsData.find(
          (round) => round.id === paymentData.round
        );
        if (findRoundData && findRoundData.circleId) {
          const findCircleData = circlesData.find(
            (circle) => circle.id === findRoundData.circleId
          );
          if (findCircleData && findCircleData.minContrib) {
            const findCircleAmount = parseInt(findCircleData.minContrib);
            calculatedAmount += findCircleAmount;
          }
        }
        setDisplayLoader(false);
      });

      setTotalAmount(calculatedAmount);
    }
  }, [paymentsData, circlesData, roundsData]);
  const fetchUsersData = async () => {
    try {
      const usersCollectionRef = collection(fireStore, "Users");
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        const userData = { ...doc.data(), id: doc.id };

        usersData.push(userData);
        setUsersData(usersData);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchPayoutsData = async () => {
    try {
      const usersCollectionRef = collection(fireStore, "Payouts");
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersData = [];
      var totalAmount = 0;
      querySnapshot.forEach((doc) => {
        const userData = { ...doc.data(), id: doc.id };
        usersData.push(userData);

        totalAmount = userData?.amount + totalAmount;

        setPayoutsData(totalAmount);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
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

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthsArray = [];
  var circlesMonthsCount = [];
  const monthNames = new Array(12).fill(0).map((_, index) => {
    const date = new Date(currentYear, index, 1);
    return date.toLocaleString("default", { month: "long" });
  });

  for (let month = 0; month <= currentMonth; month++) {
    monthsArray.push(monthNames[month]);

    circlesMonthsCount.push(0);
  }

  if (circlesData !== 0) {
    for (let i = 0; i < circlesData.length; i++) {
      if (circlesData[i]?.startDate?.seconds) {
        const circleDate = new Date(
          circlesData[i]?.startDate?.seconds * 1000
        ).toLocaleDateString();
        const dateString = circleDate;
        const [month, day, year] = dateString.split("/").map(Number);
        if (year === currentYear) {
          if (month <= circlesMonthsCount.length) {
            circlesMonthsCount[month - 1]++;
          }
        }
      } else {
        const dateString = circlesData[i]?.startDate;

        if (dateString !== null) {
          const [datePart] = dateString?.split(" ");
          const [year, month] = datePart.split("-").map(Number);
          if (year === currentYear) {
            if (month <= circlesMonthsCount.length) {
              circlesMonthsCount[month - 1]++;
            }
          }
        }
      }
    }
  }

  const data = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [...monthsArray],
      },
    },
    series: [
      {
        name: "Circles",
        data: [...circlesMonthsCount],
      },
    ],
  };

  circlesData.sort((a, b) => parseInt(b.totalAmount) - parseInt(a.totalAmount));
  const top10Circles = circlesData.slice(0, 10);
  const totalAmountArray = top10Circles.map((circle) => circle.totalAmount);
  const nameArray = top10Circles.map((circle) => circle.name);

  // Users data status Analysis

  let pending = 0;
  let deactive = 0;
  let active = 0;
  let invited = 0;
  if (usersData !== 0) {
    const activeUsers = usersData.filter((item) => item.statusId === 2);
    active = activeUsers.length;
    const pendingUsers = usersData.filter((item) => item.statusId === 1);
    pending = pendingUsers.length;
    const deactiveUsers = usersData.filter((item) => item.statusId === 3);
    deactive = deactiveUsers.length;
    const invitedUsers = usersData.filter((item) => item.statusId === 4);
    invited = invitedUsers.length;
  }
  const user = {
    series: [invited || 1, active || 1, pending || 1, deactive || 1],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["Invited", "Active", "Pending", "Deactive"],
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          return opts.w.globals.series[opts.seriesIndex];
        },
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  const data2 = {
    series: [
      {
        name: "Collective Amount",
        data: [...totalAmountArray],
        color: "#5CC8BE",
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        color: "#5CC8BE",
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [...nameArray],
      },
      yaxis: {
        title: {
          // text: "$ (thousands)",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
      },
    },
  };

  const navigate = useNavigate();
  const handleNavigation = (str, data) => {
    if (str === "manageCircle") {
      navigate("/manage-circles");
    } else if (str === "newCircle") {
      navigate("/create-new-circle");
    } else if (str === "userPending") {
      navigate("/user-pending-approval");
    } else if (str === "viewcircle") {
      navigate(`/circle-dashboard/${data.id}`);
    } else {
      navigate("/circle-pending-approval");
    }
  };

  useEffect(() => {
    const users = usersData.filter((user) => user.statusId === 1);
    setFilteredUsers(users);
  }, [usersData]);

  const handleUpdate = (data, str) => {
    setDisplayLoader(true);
    try {
      if (str === "accept") {
        const usersCollectionRef = collection(fireStore, "Users");
        const userDocRef = doc(usersCollectionRef, data.id);
        updateDoc(userDocRef, {
          statusLabel: "Active",
          statusId: 2,
        });
        fetchUsersData();
        setDisplayLoader(false);
        toast.success("Golak User account has been approved.");
      } else if (str === "reject") {
        const usersCollectionRef = collection(fireStore, "Users");
        const userDocRef = doc(usersCollectionRef, data.id);
        updateDoc(userDocRef, {
          statusLabel: "Deactive",
          statusId: 3,
        });
        fetchUsersData();
        setDisplayLoader(false);
        toast.error("User has been rejected!");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUserNavigation = (data) => {
    navigate(`/user-detail/${data?.id}`);
  };

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
      //   {
      //     headerName: "",
      //     field: "involvedUsers.length",
      //     sortable: true,
      //     filter: false,
      //     floatingFilter: false,
      //     flex: 1,
      //   },

      {
        headerName: "Actions",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1.5,
        cellRenderer: (params) => (
          <td className="flex justify-between items-center ">
            <button
              className="btn-table-style flex justify-center flex-col items-center"
              style={{
                background: "#E8EAF6",
                color: "#3749A6",
                border: "1px Solid #3749A6",
                borderRadius: "30px",
                height: "30px",
                width: "30%",
              }}
              onClick={() => handleUserNavigation(params.data)}
            >
              View
            </button>
            <button
              className="btn-table-style flex justify-center flex-col items-center"
              style={{
                background: "#E8F5E9",
                color: "#00820A",
                border: "1px Solid #00820A",
                height: "30px",
                borderRadius: "30px",
                width: "30%",
              }}
              onClick={() => handleUpdate(params.data, "accept")}
            >
              Approve
            </button>
            <button
              className="btn-table-style flex justify-center flex-col items-center"
              style={{
                background: "#FF00001A",
                color: "#FF0000",
                border: "1px Solid #FF0000",
                borderRadius: "30px",
                height: "30px",
                width: "30%",
              }}
              onClick={() => handleUpdate(params?.data, "reject")}
            >
              Reject
            </button>
          </td>
        ),
      },
    ],
    [usersData]
  );

  const columnDefForlatestCircles = useMemo(
    () => [
      {
        headerName: "Circle ID",
        field: "id",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      // {
      //   headerName: "Name",
      //   field: "name",
      //   sortable: true,
      //   filter: false,
      //   floatingFilter: false,
      //   flex: 1,
      // },
      {
        headerName: "Circle Name",
        field: "name",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => {
          const circleName = params?.data?.name;

          return (
            <Link to={`/circle-dashboard/${params?.data?.id}`}>
              {circleName}
            </Link>
          );
        },
      },
      {
        headerName: "Contribution Type",
        field: "contribType",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "Total Amount",
        field: "totalAmount",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "No. of People",
        field: "involvedUsers.length",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },

      {
        headerName: "Start Date",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => (
          <>
            {params?.data?.startDate?.seconds
              ? new Date(
                  params?.data?.startDate?.seconds * 1000
                ).toLocaleDateString()
              : params?.data.startDate.split(" ")[0]}
          </>
        ),
      },
    ],
    []
  );

  // var filteredCircles;
  useEffect(() => {
    const circles = circlesData.filter((circle) => circle.statusId === 1);
    setFilteredCircles(circles);
  }, [circlesData]);

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
      rowHeight: 36,
    };
  }, []);

  const headerCellRenderer = ({ value }) => {
    return (
      <div className="ag-cell-label-container">
        <span className="ag-header-cell-text">{value}</span>
      </div>
    );
  };

  const cellRenderer = ({ value }) => {
    return (
      <div className="ag-cell-value">
        <span>{value}</span>
      </div>
    );
  };

  const circleUpdateStatus = (data, str) => {
    setDisplayLoader(true);
    try {
      if (str === "accept") {
        let user = [];
        for (let i = 0; i < data?.involvedUsers?.length; i++) {
          const findUser = usersData.find(
            (item) =>
              item?.id === data?.involvedUsers[i] &&
              (item?.statusId === 3 ||
                item?.statusId === 1 ||
                item?.statusId === 4)
          );

          if (findUser !== undefined) {
            user = [...user, findUser];
            break;
          }
        }
        if (user.length === 0) {
          const usersCollectionRef = collection(fireStore, "Circles");
          const userDocRef = doc(usersCollectionRef, data.id);
          updateDoc(userDocRef, {
            statusLabel: "Active",
            statusId: 2,
          });
          fetchCirclesData();
          setDisplayLoader(false);
          toast.success("Circle has been approved.");
        } else {
          setDisplayLoader(false);
          toast.error(`This circle cannot be able to approve. First approve/register the inactive users involved in this circle.
          User Name: ${user[0].username}
          Email: ${user[0].email}
        `);
        }
      } else if (str === "reject") {
        const usersCollectionRef = collection(fireStore, "Circles");
        const userDocRef = doc(usersCollectionRef, data.id);
        updateDoc(userDocRef, {
          statusLabel: "Deactive",
          statusId: 3,
        });
        fetchCirclesData();
        setDisplayLoader(false);
        toast.error("Circle has been rejected!");
      }
    } catch (error) {
      setDisplayLoader(false);

      console.error("Error fetching users:", error);
    }
  };

  const sortedCircleData = circlesData.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;

    return b.id - a.id;
  });

  const filterCircleUpcomingPayout = circlesData.filter(
    (item) => item.statusId === 2
  );
  var totalUpcomingSumPayout = 0;

  for (let i = 0; i < filterCircleUpcomingPayout.length; i++) {
    totalUpcomingSumPayout =
      totalUpcomingSumPayout +
      parseInt(filterCircleUpcomingPayout[i].totalAmount);
  }

  return (
    <div className="p-10 body-padding">
      <h1 className="heading">Dashboard</h1>
      <Box className=" w-full flex flex-row justify-between">
        <Box className="box-shadow flex flex-row justify-center items-center w-[24%]">
          <Toaster />
          {displayLoader ? <Loader /> : ""}
          <Box>
            <img src={activeUsers} alt="" className="img-wh" />
          </Box>
          <Box className="flex flex-col ml-3">
            <p
              className="font-style"
              style={{
                color: "#8280FF",
              }}
            >
              {usersData.length}
            </p>
            <p className="font-sub-style">Total Users</p>
          </Box>
        </Box>
        <Box className="box-shadow flex flex-row justify-center items-center w-[24%]">
          {" "}
          <Box>
            <img src={amountCollected} alt="" className="img-wh" />
          </Box>
          <Box className="flex flex-col ml-3">
            <p
              className="font-style"
              style={{
                color: "#FF9871",
              }}
            >
              ${payoutsData}
            </p>
            <p className="font-sub-style">Amount Facilitated</p>
          </Box>
        </Box>

        <Box className="box-shadow flex flex-row justify-center items-center w-[24%]">
          {" "}
          <Box>
            <img src={totalPayments} alt="" className="img-wh" />
          </Box>
          <Box className="flex flex-col ml-3">
            <p
              className="font-style"
              style={{
                color: "#FFC107",
              }}
            >
              ${totalAmount}
            </p>
            <p className="font-sub-style">
              Total Payments
              <br />
              (Completed)
            </p>
          </Box>
        </Box>
        <Box className="box-shadow flex flex-row justify-center items-center w-[24%]">
          {" "}
          <Box>
            <img src={totalPayouts} alt="" className="img-wh" />
          </Box>
          <Box className="flex flex-col ml-3">
            <p
              className="font-style"
              style={{
                color: "#6EE1A7",
              }}
            >
              ${totalUpcomingSumPayout}
            </p>
            <p className="font-sub-style">
              Total Payouts
              <br />
              (Upcoming)
            </p>
          </Box>
        </Box>
      </Box>
      <Box className=" w-full flex flex-row justify-between mt-4 box-shadow">
        <Box className="w-50p">
          <h1 className="heading">New Circles</h1>
          <Chart
            options={data.options}
            series={data.series}
            height="414"
            type="bar"
          />
        </Box>
        <Box className="w-50p ml-5">
          <h1 className="heading w-full">Circles</h1>
          <Box className="flex flex-row w-full mt-2 justify-between">
            <Box
              className="w-249 box-shadow flex flex-col justify-center items-center "
              style={{
                background: "#E8EAF6",
              }}
            >
              <p
                className="font-style"
                style={{
                  color: "#283593",
                }}
              >
                {circlesData.length}
              </p>
              <p
                className="font-sub-style"
                style={{
                  color: "#283593",
                }}
              >
                Total Circles
              </p>
            </Box>
            <Box
              className="w-249 box-shadow flex flex-col justify-center items-center ml-3"
              style={{
                background: "#E8F5E9",
              }}
            >
              <p
                className="font-style"
                style={{
                  color: "#2E7D32",
                }}
              >
                {filteredCircles.length}
              </p>
              <p
                className="font-sub-style text-center"
                style={{
                  color: "#2E7D32",
                }}
              >
                Circles Pending Approvals
              </p>
            </Box>
          </Box>
          <Box className="flex flex-row w-full mt-4 justify-between">
            <Box className="flex flex-row justify-between w-full">
              <h1 className="heading w-full">Circles Pending Approvals</h1>
              <button
                className="btn-style"
                onClick={() => handleNavigation("seeAll")}
              >
                See all
              </button>
            </Box>
          </Box>
          <Box className="w-full mt-4">
            <hr />
            <table className="w-full ">
              <thead>
                <th className="flex flex-row justify-between">
                  <td className=" font-fam-nunito w-[25%]">Circle Name</td>
                  <td className=" font-fam-nunito w-[25%]  ">Start Date</td>
                  <td className="font-fam-nunito w-[50%] ">Actions</td>
                </th>
              </thead>
              <hr />

              <tbody>
                {filteredCircles.slice(0, 3).map((item, index) => (
                  <>
                    <tr
                      className="flex flex-row mt-3 mb-3 justify-between"
                      key={index}
                    >
                      <td className="w-[25%]">
                        {item.name.length > 20
                          ? `${item.name.substring(0, 20)}...`
                          : item.name}
                      </td>
                      <td className="w-[25%]">
                        {item?.startDate?.seconds
                          ? new Date(
                              item?.startDate?.seconds * 1000
                            ).toLocaleDateString()
                          : item.startDate.split(" ")[0]}
                      </td>
                      <td className="flex flex-row justify-between items-center w-[50%]">
                        <button
                          className="btn-table-style"
                          style={{
                            background: "#E8EAF6",
                            color: "#3749A6",
                            border: "1px Solid #3749A6",
                            borderRadius: "30px",
                            height: "30px",
                            width: "30%",
                          }}
                          onClick={() => handleNavigation("viewcircle", item)}
                        >
                          View
                        </button>
                        <button
                          className=" text-center ml-1"
                          style={{
                            background: "#E8F5E9",
                            color: "#00820A",
                            border: "1px Solid #00820A",
                            borderRadius: "30px",
                            height: "30px",
                            width: "80px",
                            padding: "0px 7px",
                          }}
                          onClick={() => circleUpdateStatus(item, "accept")}
                        >
                          Approve
                        </button>
                        <button
                          className="text-center ml-1 "
                          style={{
                            background: "#FF00001A",
                            color: "#FF0000",
                            border: "1px Solid #FF0000",
                            borderRadius: "30px",
                            height: "30px",
                            width: "30%",
                          }}
                          onClick={() => circleUpdateStatus(item, "reject")}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                    <hr />
                  </>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>
      <Box className=" w-full flex flex-row justify-between mt-4 box-shadow">
        <Box className="w-50p">
          <h1 className="heading"> Users Status Analysis</h1>
          <Chart
            options={user.options}
            series={user.series}
            height="414"
            type="pie"
          />
        </Box>
        <Box className="w-50p">
          <h1 className="heading w-full">Maximum Cumulative Circles</h1>
          <Chart
            options={data2.options}
            series={data2.series}
            height="485"
            type="bar"
            style={{
              color: "#5CC8BE",
            }}
          />
        </Box>
      </Box>

      <Box className=" w-full mt-4 box-shadow flex-wrap ">
        <Box className="flex flex-row w-full justify-between flex-wrap">
          <h1 className="heading ">Users Pending Approval</h1>
          {/* <SearchBar /> */}
          <button
            className="dropdown btn-style"
            onClick={() => handleNavigation("userPending")}
          >
            See all
          </button>
        </Box>
        <Box className="w-full mt-3">
          <div className="ag-theme-quartz" style={{ height: 260 }}>
            <AgGridReact
              rowData={filteredUsers.slice(0, 3)}
              columnDefs={columnDefs.map((colDef) => ({
                ...colDef,
                headerComponentFramework: () => headerCellRenderer,
                cellRendererFramework: () => cellRenderer,
              }))}
              defaultColDef={defaultColDef}
              rowSelection="multiple"
              rowHeight={70}
              className="custom-ag-grid"
            />
          </div>
        </Box>
      </Box>

      <Box className=" w-full mt-4 box-shadow flex-wrap">
        <Box className="flex flex-row w-full justify-between flex-wrap">
          <h1 className="heading ">Latest circles will be shown here</h1>
          {/* <SearchBar /> */}
          <Box className="flex">
            <Button
              variant="outlined"
              className="dropdown "
              onClick={() => handleNavigation("manageCircle")}
              style={{
                marginRight: "20px",
                borderRadius: "7px",
                textTransform: "capitalize",
                color: "#4379EE",
              }}
            >
              Manage Circles
            </Button>
            <Button
              variant="contained"
              className="dropdown "
              style={{
                background: "#4379EE",
                borderRadius: "7px",
                textTransform: "capitalize",
              }}
              onClick={() => handleNavigation("newCircle")}
            >
              Add New Circle
            </Button>
          </Box>
        </Box>
        <Box className="w-full mt-4">
          <div className="ag-theme-quartz" style={{ height: 260 }}>
            <AgGridReact
              rowData={sortedCircleData.slice(0, 3)}
              columnDefs={columnDefForlatestCircles.map((colDef) => ({
                ...colDef,
                headerComponentFramework: () => headerCellRenderer,
                cellRendererFramework: () => cellRenderer,
              }))}
              defaultColDef={defaultColDef}
              rowSelection="multiple"
              rowHeight={70}
              className="custom-ag-grid"
            />
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
