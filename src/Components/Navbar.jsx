import React from "react";
import { Link } from "react-router-dom";
import SidebarLogo from "../Assets/Images/dashboardlogo.png";
import { useDispatch } from "react-redux";
import { logout } from "../Store/AuthSlice/authSlice";
import { useNavigate } from "react-router-dom";
const Navbar = ({ userData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = (str) => {
    if (str === "logout") {
      dispatch(logout());
    } else if (str === "profile") {
      navigate("/profile");
    }
  };

  const href = window.location.href;
  const url = href.split("/")[3];

  return userData.statusId !== 3 && userData.statusId !== 1 ? (
    <div className="sidebar">
      <div
        className="p-[11px] w-full flex justify-center mb-16"
        style={{
          borderBottom: "1px Solid white",
        }}
      >
        <img alt="" src={SidebarLogo}></img>
      </div>
      <div className="mb-24">
        {userData?.role === "admin" ? (
          <>
            {userData.isDashboard === true && (
              <Link
                to={"/"}
                className={`nav-link ${url === "" ? "active-nav" : ""}`}
              >
                Dashboard
              </Link>
            )}
            {userData.isListofUsers === true && (
              <Link
                to={"/users-list"}
                className={`nav-link ${
                  url === "users-list" ? "active-nav" : ""
                }`}
              >
                App Users
              </Link>
            )}
            {userData.isApprove === true && (
              <Link
                to={"/user-pending-approval"}
                className={`nav-link ${
                  url === "user-pending-approval" ? "active-nav" : ""
                }`}
              >
                Users Approval
              </Link>
            )}
            {userData.isAdminCreated === true && (
              <Link
                to={"/create-admin"}
                className={`nav-link ${
                  url === "create-admin" ? "active-nav" : ""
                }`}
              >
                Create Admin
              </Link>
            )}
            {userData.isAdminCreated === true && (
              <Link
                to={"/admins-list"}
                className={`nav-link ${
                  url === "admins-list" ? "active-nav" : ""
                }`}
              >
                Admin Users
              </Link>
            )}
            {userData.isCircleCreate === true && (
              <Link
                to={"/create-new-circle"}
                className={`nav-link ${
                  url === "create-new-circle" ? "active-nav" : ""
                }`}
              >
                Create New Circle
              </Link>
            )}
            {userData.isApprove === true && (
              <Link
                to={"/circle-pending-approval"}
                className={`nav-link ${
                  url === "circle-pending-approval" ? "active-nav" : ""
                }`}
              >
                Circles Approval
              </Link>
            )}
            {userData.isCircleCreate === true && (
              <Link
                to={"/manage-circles"}
                className={`nav-link ${
                  url === "manage-circles" ? "active-nav" : ""
                }`}
              >
                Circle List
              </Link>
            )}

            {/* {userData.addMembers === true && (
              <Link to={"/add-users"}>Add Members</Link>
            )} */}
          </>
        ) : (
          <>
            <Link
              to={"/"}
              className={`nav-link ${url === "" ? "active-nav" : ""}`}
            >
              Dashboard
            </Link>

            <Link
              to={"/users-list"}
              className={`nav-link ${url === "users-list" ? "active-nav" : ""}`}
            >
              App Users
            </Link>
            <Link
              to={"/user-pending-approval"}
              className={`nav-link ${
                url === "user-pending-approval" ? "active-nav" : ""
              }`}
            >
              Users Approval
            </Link>
            <Link
              to={"/admins-list"}
              className={`nav-link ${
                url === "admins-list" ? "active-nav" : ""
              }`}
            >
              Admin Users
            </Link>
            <Link
              to={"/create-new-circle"}
              className={`nav-link ${
                url === "create-new-circle" ? "active-nav" : ""
              }`}
            >
              Create Circle
            </Link>
            <Link
              to={"/circle-pending-approval"}
              className={`nav-link ${
                url === "circle-pending-approval" ? "active-nav" : ""
              }`}
            >
              Circles Approval
            </Link>
            <Link
              to={"/manage-circles"}
              className={`nav-link ${
                url === "manage-circles" ? "active-nav" : ""
              }`}
            >
              Circle List
            </Link>
          </>
        )}
      </div>
      <div className="flex flex-col items-start mr-[24%]">
        <Link onClick={() => handleLogout("logout")} className="nav-link">
          Logout
        </Link>
        {/* <Link onClick={() => handleLogout("profile")}>Settings</Link> */}
      </div>
    </div>
  ) : (
    ""
  );
};

export default Navbar;
