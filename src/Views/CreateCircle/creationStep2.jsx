import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { CgAddR } from "react-icons/cg";

const CreationStep2 = ({ setStep1Data, step1Data, setMembers, members }) => {
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

  const stringNumber = step1Data.numUsers;
  const number = parseInt(stringNumber, 10);

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];

    if (field === "email") {
      updatedMembers[index][field] = value.toLowerCase();
      setMembers(updatedMembers);
    } else {
      updatedMembers[index][field] = value;
      setMembers(updatedMembers);
    }
  };

  return (
    <Box className="mt-4 p-2 flex flex-col w-full justify-between">
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
          className="dropdown w-full mt-4 flex flex-row "
          style={{
            color: number === members.length ? "darkGray" : "#4379EE",
            border: number !== members.length && "1px solid #4379EE",
            padding: "12px 0px",
            background: number === members.length && "#EBEBE4",
          }}
          variant="outlined"
          disabled={number === members.length}
          onClick={handleAddMember}
        >
          {" "}
          <CgAddR size={20} className="mr-2" />
          Add New Member
        </Button>
      </Box>
    </Box>
  );
};

export default CreationStep2;
