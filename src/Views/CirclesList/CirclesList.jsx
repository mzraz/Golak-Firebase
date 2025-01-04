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

const ITEM_HEIGHT = 48;
const CirclesList = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [circlesData, setCirclesData] = useState([]);
  useEffect(() => {
    fetchCirclesData();
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
            {params.data.startDate
              ? new Date(
                  params.data.startDate.seconds * 1000
                ).toLocaleDateString()
              : ""}
          </>
        ),
      },
      {
        headerName: "End Date",
        field: "updated_at",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            {params.data.updated_at
              ? new Date(
                  params.data.updated_at.seconds * 1000
                ).toLocaleDateString()
              : ""}
            <IconButton
              aria-label="more"
              id="long-button"
              className="dropdown"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
          </div>
        ),
      },
    ],
    []
  );

  const sortedCircleData = circlesData.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;

    return b.id - a.id;
  });

  return (
    <div className="p-10 body-padding">
      <h1 className="heading">Circles Data</h1>
      <Box className="box-shadow">
        <Box className="flex flex-row w-full justify-between mb-4">
          <SearchBar />
          <Box>
            <Button variant="outlined" className="mr-4 dropdown">
              Manage Circle
            </Button>
            <Button variant="contained" className="dropdown">
              Add New Circle
            </Button>
          </Box>
        </Box>

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
          <MenuItem onClick={handleClose}>{"Select Circle"}</MenuItem>
        </Menu>
        <DataTable columnDefs={columnDefs} rowData={sortedCircleData} />
      </Box>
    </div>
  );
};

export default CirclesList;
