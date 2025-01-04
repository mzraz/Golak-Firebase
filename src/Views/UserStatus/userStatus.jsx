import React, { useEffect, useState, useMemo } from "react";
import { Box } from "@mui/material";
import SearchBar from "../../Components/SearchBar";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { fireStore } from "../../Firebase/Firebase";
import DataTable from "../../Components/DataGrid";
import Loader from "../../Components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { FaGreaterThan } from "react-icons/fa6";
import { MdOutlineHome } from "react-icons/md";
import ModalData from "../../Components/Modal";
const UserStatus = () => {
  const navigate = useNavigate();

  const [usersData, setUsersData] = useState([]);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [circlesData, setCirclesData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    fetchUsersData();
    fetchCirclesData();
  }, []);
  const fetchUsersData = async () => {
    setDisplayLoader(true);
    try {
      const usersCollectionRef = collection(fireStore, "Users");
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        const circleData = { ...doc.data(), id: doc.id };
        usersData.push(circleData);
      });
      const findApproveUsers = usersData.filter(
        (item) => item.statusId === 1 || item.statusId === 3
      );
      setUsersData(findApproveUsers);
      setDisplayLoader(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleNavigation = (params) => {
    navigate(`/user-detail/${params?.id}`);
  };

  const fetchCirclesData = async () => {
    setDisplayLoader(true);
    try {
      const usersCollectionRef = collection(fireStore, "Circles");
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ ...doc.data(), id: doc.id });
        const usersFilter = usersData.filter((item) => item.statusId !== 4);
        setCirclesData(usersFilter);
        setDisplayLoader(false);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  var usersUpdatedData = [];
  if (circlesData.length !== 0 && usersData.length !== 0) {
    for (let i = 0; i < usersData.length; i++) {
      const findCircles = circlesData.filter((item) =>
        item.involvedUsers.includes(usersData[i].id)
      );
      let updatedUser = {
        ...usersData[i],
        circles: findCircles,
      };
      usersUpdatedData.push(updatedUser);
    }
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
        headerName: "Status",
        field: "statusLabel",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "Circles",
        sortable: false,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => {
          let circleLength = params.data.circles.length;
          let circleVar = "";
          if (circleLength === 0) {
            circleVar = "No Circle";
          } else if (circleLength === 1) {
            circleVar = params.data.circles[0].name;
          } else {
            circleVar = "multiple";
          }
          return <div className="">{circleVar}</div>;
        },
      },

      {
        headerName: "Actions",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 2,
        cellRenderer: (params) => (
          <td
            className={`flex flex-row ${
              params.data.statusId === 3 ? "justify-start" : "justify-between"
            }  items-center `}
          >
            <button
              className="btn-table-style flex justify-center items-center"
              style={{
                background: "#E8EAF6",
                color: "#3749A6",
                border: "1px Solid #3749A6",
                borderRadius: "30px",
                height: "30px",
                width: "30%",
              }}
              onClick={() => handleNavigation(params.data)}
            >
              View
            </button>
            <button
              className="btn-table-style flex justify-center items-center"
              style={{
                background: "#E8F5E9",
                color: "#00820A",
                border: "1px Solid #00820A",
                borderRadius: "30px",
                height: "30px",
                width: "90px",
              }}
              onClick={() => handleUpdate(params.data, "accept")}
              //
            >
              Approve
            </button>
            {params.data.statusId === 3 ? (
              ""
            ) : (
              <button
                className="btn-table-style flex justify-center items-center"
                style={{
                  background: "#FF00001A",
                  color: "#FF0000",
                  border: "1px Solid #FF0000",
                  borderRadius: "30px",
                  height: "30px",
                  width: "30%",
                }}
                onClick={() => handleUpdate(params.data, "reject")}
              >
                Reject
              </button>
            )}
          </td>
        ),
      },
    ],
    []
  );

  const handleSearch = (event) => {
    const searchString = event.target.value;
    if (searchString !== "") {
      const filterData = usersUpdatedData?.filter((item) =>
        item?.username?.toLowerCase().includes(searchString.toLowerCase())
      );
      setSearchData([...filterData]);
    } else {
      setSearchData([]);
    }
  };

  const handleUpdate = (data, str) => {
    setDisplayLoader(true);
    try {
      if (str === "accept") {
        emailjs.send(
          "service_ege6h0u",
          "template_xc0c3wz",
          {
            from_name: "Golak",
            to_name: `${data.username}`,
            message:
              "Your profile has been approved. Please enjoy managing your Golak Circles!",
            email: `${data.email}`,
          },
          {
            publicKey: "NjVoOMCv8ZqG7d5aa",
          }
        );

        const usersCollectionRef = collection(fireStore, "Users");
        const userDocRef = doc(usersCollectionRef, data.id);
        updateDoc(userDocRef, {
          statusLabel: "Active",
          statusId: 2,
        });
        fetchUsersData();
        setDisplayLoader(false);
        toast.success("User has been approved.");
      } else if (str === "reject") {
        emailjs.send(
          "service_ege6h0u",
          "template_xc0c3wz",
          {
            from_name: "Golak",
            to_name: `${data.username}`,
            message: "Your profile has been deactivate!",
            email: `${data.email}`,
          },
          {
            publicKey: "NjVoOMCv8ZqG7d5aa",
          }
        );
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

  const openModal = () => {
    setModalOpen(true);
  };
  return (
    <div className="p-10 body-padding">
      <Box className="flex flex-col">
        <ModalData
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          text={"Are you sure you want to approve this User?"}
        />
        <Box className="breadcrumbs flex flex-row justify-between w-[160px] mb-4 items-center">
          <Link to={"/"} className="breadcrumbs flex flex-row items-center ">
            {" "}
            <MdOutlineHome size={16} /> Home
          </Link>{" "}
          <FaGreaterThan size={14} />{" "}
          <Link to={"#"} className="breadcrumbs">
            Users Status
          </Link>
        </Box>
        <h1 className="heading">Users Pending Approval</h1>
      </Box>
      <Box className="box-shadow">
        {displayLoader ? <Loader /> : ""}
        <Toaster />
        <Box className="flex flex-row w-full justify-between mb-4">
          <SearchBar onChange={(event) => handleSearch(event)} />
        </Box>

        <DataTable
          columnDefs={columnDefs}
          rowData={searchData.length === 0 ? usersUpdatedData : searchData}
        />
      </Box>
    </div>
  );
};

export default UserStatus;
