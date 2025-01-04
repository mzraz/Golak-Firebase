import React, { useEffect, useState, useMemo } from "react";
import { Box, Button } from "@mui/material";
import SearchBar from "../../Components/SearchBar";
import { collection, getDocs } from "firebase/firestore";
import { fireStore, auth } from "../../Firebase/Firebase";
import DataTable from "../../Components/DataGrid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate, Link } from "react-router-dom";
import { FaGreaterThan } from "react-icons/fa6";
import { MdOutlineHome } from "react-icons/md";
import LinearProgress from "@mui/material/LinearProgress";
import Loader from "../../Components/Loader";

const ITEM_HEIGHT = 48;
const ManageCircles = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchData, setSearchData] = useState([]);
  const [displayLoader, setDisplayLoader] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [circlesData, setCirclesData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [roundsData, setRoundsData] = useState([]);
  const [updatedCirclesData, setUpdatedCirclesData] = useState([]);
  const [payoutsData, setPayoutsData] = useState([]);
  const [searchStr, setSearchStr] = useState("");
  useEffect(() => {
    fetchCirclesData();
    fetchRoundsData();
    fetchPayouts();
  }, []);
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
  const fetchPayouts = async () => {
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
  const fetchCirclesData = async () => {
    setDisplayLoader(true);
    try {
      const usersCollectionRef = collection(fireStore, "Circles");
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        const circleData = { ...doc.data(), id: doc.id };
        usersData.push(circleData);
        setCirclesData(usersData);
        setDisplayLoader(false);
      });
    } catch (error) {
      setDisplayLoader(false);
      console.error("Error fetching users:", error);
    }
  };
  var updatedCircles = [];

  if (circlesData.length !== 0) {
    for (let i = 0; i < circlesData.length; i++) {
      let rounds = [];
      let payouts = [];
      let percentage = 0;

      const filterRounds = roundsData.filter(
        (item) => item.circleId === circlesData[i].id
      );
      rounds = [...filterRounds];
      if (filterRounds.length !== 0) {
        for (let j = 0; j < filterRounds?.length; j++) {
          const filterPayout = payoutsData.find(
            (item) => item.round === filterRounds[j]?.id
          );

          if (filterPayout !== undefined) {
            payouts = [...payouts, filterPayout];
          }
        }
        if (rounds.length === 0) {
          percentage = 0;
        } else {
          percentage = (payouts?.length / rounds?.length) * 100;
        }
      }
      const updatedCircle = {
        ...circlesData[i],
        circleCompletion: percentage,
      };
      updatedCircles.push(updatedCircle);
    }
  }

  const determineColor = (percentage) => {
    if (percentage < 40) {
      return "#f44336";
    } else if (percentage >= 40 && percentage < 80) {
      return "#ff9800";
    } else {
      return "#4caf50";
    }
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Circle ID",
        field: "id",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "Circle Name",
        field: "name",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      // {
      //   headerName: "Circle Name",
      //   field: "name",
      //   sortable: true,
      //   filter: false,
      //   floatingFilter: false,
      //   flex: 1,
      //   cellRenderer: (params) => {
      //     const circleName = params?.data?.name;

      //     return (
      //       <Link to={`/circle-dashboard/${params?.data?.id}`}>
      //         {circleName}
      //       </Link>
      //     );
      //   },
      // },
      {
        headerName: "No. of Members",
        field: "involvedUsers.length",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "Circle Status",
        field: "statusLabel",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "Progress",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1.5,
        cellRenderer: (params) => {
          const circleData = params.data.circleCompletion;
          return (
            <div className="flex flex-row items-center justify-center">
              <LinearProgress
                variant="determinate"
                value={circleData}
                className="w-[70%] css-height"
                sx={{
                  "& .MuiLinearProgress-bar": {
                    transition: "background-color 0.5s ease",

                    backgroundColor: determineColor(circleData),
                  },
                }}
              />
              <p className="ml-3">{circleData.toFixed(1)}%</p>
            </div>
          );
        },
      },
      {
        headerName: "Actions",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 3,
        cellRenderer: (params) => {
          const circleData = params.data;

          return (
            <td className="flex flex-row justify-between">
              <Button
                variant="contained"
                className="dropdown"
                style={{
                  background: "#d9e4fc",
                  color: "#4379EE",
                  fontWeight: "700",
                }}
                onClick={() => handleNavigation("ledger", circleData)}
              >
                Ledger
              </Button>
              <Button
                variant="contained"
                className="dropdown"
                style={{
                  background: "#d9e4fc",
                  color: "#4379EE",
                  fontWeight: "700",
                }}
                onClick={() => handleNavigation("dashboard", circleData)}
              >
                Dashboard
              </Button>
              <Button
                variant="outlined"
                className="dropdown"
                style={{
                  fontWeight: "700",
                }}
                onClick={() => handleNavigation("manage", circleData)}
              >
                Manage
              </Button>
            </td>
          );
        },
      },
    ],
    []
  );

  const navigate = useNavigate();

  const handleNavigation = (str, data) => {
    if (str === "newCircle") {
      navigate("/create-new-circle");
    } else if (str === "ledger") {
      navigate(`/ledger/${data.id}`);
    } else if (str === "dashboard") {
      navigate(`/circle-dashboard/${data.id}`);
    } else if (str === "manage") {
      navigate(`/organise-circle/${data.id}`);
    } else {
      navigate("#");
    }
  };

  // const sortedCircleData = updatedCircles.sort((a, b) => {
  //   const dateA = new Date(a.created_at);
  //   const dateB = new Date(b.created_at);

  //   if (dateA > dateB) return -1;
  //   if (dateA < dateB) return 1;

  //   return b.id - a.id;
  // });
  // console.log(sortedCircleData, updatedCircles);

  const handleSearch = (event) => {
    const searchString = event.target.value;
    setSearchStr(searchString);
    if (searchString !== "") {
      const filterData = updatedCircles.filter((item) =>
        item.name.toLowerCase().includes(searchString.toLowerCase())
      );
      setSearchData([...filterData]);
    } else {
      setSearchData([]);
    }
  };

  return (
    <div className="p-10 body-padding">
      <Box className="flex flex-col">
        <Box className="breadcrumbs flex flex-row justify-between w-[170px] mb-4 items-center">
          <Link to={"/"} className="breadcrumbs flex flex-row items-center ">
            {" "}
            <MdOutlineHome size={16} /> Home
          </Link>{" "}
          <FaGreaterThan size={14} />{" "}
          <Link to={"#"} className="breadcrumbs">
            Manage Circles
          </Link>
        </Box>
        <h1 className="heading">Manage</h1>
      </Box>

      <Box className="box-shadow">
        {displayLoader ? <Loader /> : ""}
        <Box className="flex flex-row w-full justify-between items-center mb-4">
          <SearchBar onChange={(event) => handleSearch(event)} />
          <Button
            variant="contained"
            className="dropdown"
            onClick={() => handleNavigation("newCircle")}
          >
            Add New Circle
          </Button>
        </Box>

        <DataTable
          columnDefs={columnDefs}
          rowData={searchStr === "" ? updatedCircles : searchData}
        />
      </Box>
    </div>
  );
};

export default ManageCircles;
