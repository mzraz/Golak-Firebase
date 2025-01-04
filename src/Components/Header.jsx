import React, { useState } from "react";
import { Avatar } from "@mui/material";
import { initialAuth } from "../Store/AuthSlice/authSlice";
import { useSelector } from "react-redux";
import { IoIosArrowDropdown } from "react-icons/io";
import Notification from "../Assets/Images/notification.png";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Store/AuthSlice/authSlice";
const ITEM_HEIGHT = 48;
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [usersData, setUsersData] = useState([]);
  const [originalUsersData, setOriginalUsersData] = useState([]);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = () => {
    navigate("/profile");
    handleClose();
  };

  const handleLogout = () => {
    dispatch(logout());
  };
  const userData = useSelector(initialAuth);
  return userData?.user?.statusId !== 3 && userData?.user?.statusId !== 1 ? (
    <div
      className=""
      style={{
        marginLeft: "250px",
      }}
    >
      <ul className="flex justify-end">
        <li className="flex justify-center items-center mr-3">
          {/* <img src={Notification} alt="" /> */}
        </li>
        {/* <li className="flex justify-center items-center mr-3">
          <select>
            <option>English</option>
            {/* <option>Arabic</option>
            <option>Urdu</option>
          </select>
        </li> */}
        <li className="flex justify-center items-center ">
          <Avatar alt="Remy Sharp" src={userData.user.imgUrl} />
          <div>
            <h2 className="header-heading">{userData?.user?.firstName}</h2>
            <p className="header-subHeading">{userData.user.role}</p>
          </div>

          <IconButton
            aria-label="more"
            id="long-button"
            className="dropdown"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <IoIosArrowDropdown size={20} />
          </IconButton>
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
            <MenuItem onClick={handleNavigation}>{"Profile"}</MenuItem>
            <MenuItem onClick={handleLogout}>{"Logout"}</MenuItem>
          </Menu>
        </li>
      </ul>
    </div>
  ) : (
    ""
  );
};

export default Header;
