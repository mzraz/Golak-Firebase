import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
const CreationStep1 = ({ setStep1Data, step1Data, errors, setErrors }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "numUsers") {
      if (value < 3) {
        setStep1Data({
          ...step1Data,
          [name]: 3,
        });
      } else {
        setStep1Data({
          ...step1Data,
          [name]: value,
          totalAmount: value * step1Data.minContrib,
        });
      }
    } else if (name === "minContrib") {
      setStep1Data({
        ...step1Data,
        [name]: value,
        totalAmount: value * step1Data.numUsers,
      });
    } else {
      setStep1Data({
        ...step1Data,
        [name]: value,
      });
    }
    if (name === "name") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: value.trim() ? "" : "Circle Name is required",
      }));
    } else if (name === "minContrib") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        minContrib: value.trim() ? "" : "Minimum Contribution is required",
      }));
    } else if (name === "totalAmount") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        totalAmount: value.trim() ? "" : "Total Amount is required",
      }));
    } else if (name === "numUsers") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        numUsers: value.trim() ? "" : "Number of People is required",
      }));
    } else if (name === "startDate") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        startDate: value.trim() ? "" : "Start Date is required",
      }));
    } else if (name === "slot") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: value.trim() ? "" : "Slot is required.",
      }));
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }

    return `${year}-${month}-${day}`;
  };
  return (
    <Box className="mt-4 p-2 flex flex-col w-full justify-between">
      <Box className="flex flex-row justify-between">
        <Box className="w-50 mr-4 flex flex-col">
          <label className="label">Circle Name</label>
          <TextField
            required
            id="outlined-required"
            className="bgd-input"
            name="name"
            onChange={(event) => handleChange(event)}
            value={step1Data.name}
            placeholder="Enter Circle Name"
            error={!!errors.name}
            helperText={errors.name}
          />
        </Box>
        <Box className="w-50 flex flex-col ">
          <label className="label">Minimum Contribution</label>
          <TextField
            required
            id="outlined-required"
            className="bgd-input"
            type="number"
            placeholder="Enter Minimum Contribution"
            name="minContrib"
            onChange={(event) => handleChange(event)}
            value={step1Data.minContrib}
            error={!!errors.minContrib}
            helperText={errors.minContrib}
          />
        </Box>
      </Box>
      <Box className="flex flex-row justify-between mt-5">
        <Box className="w-50 mr-4 flex flex-col">
          <label className="label">Contribution Type</label>
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              className="bgd-input"
              id="demo-simple-select"
              name="contribType"
              onChange={(event) => handleChange(event)}
              value={step1Data.contribType}
              error={!!errors.contribType}
              helperText={errors.contribType}
            >
              <MenuItem value={1}>Daily</MenuItem>
              <MenuItem value={2}>Weekly</MenuItem>
              <MenuItem value={4}>Monthly</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box className="w-50 flex flex-col ">
          <label className="label">Total Amount</label>
          <TextField
            required
            id="outlined-required"
            className="bgd-input"
            placeholder="Enter Total Amount"
            type="number"
            name="totalAmount"
            onChange={(event) => handleChange(event)}
            value={step1Data.totalAmount}
            error={!!errors.totalAmount}
            helperText={errors.totalAmount}
          />
        </Box>
      </Box>
      <Box className="flex flex-row justify-between mt-5">
        <Box className="w-50 mr-4 flex flex-col">
          <label className="label">Number of People</label>
          <TextField
            required
            id="outlined-required"
            className="bgd-input"
            type="number"
            placeholder="Select Number of People"
            name="numUsers"
            onChange={(event) => handleChange(event)}
            value={step1Data.numUsers}
            error={!!errors.numUsers}
            helperText={errors.numUsers}
          />
        </Box>
        <Box className="w-50 flex flex-col ">
          <label className="label">Start Date</label>
          <TextField
            required
            id="outlined-required"
            className="bgd-input"
            type="date"
            placeholder="Select Start Date"
            name="startDate"
            onChange={(event) => handleChange(event)}
            value={step1Data.startDate}
            error={!!errors.startDate}
            helperText={errors.startDate}
            inputProps={{ min: getTodayDate() }}
          />
        </Box>
      </Box>
      <Box className="flex flex-row justify-between mt-5">
        <Box className="w-50 flex mr-4 flex-col">
          <label className="label">Slots</label>
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              className="bgd-input"
              id="demo-simple-select"
              name="slot"
              onChange={(event) => handleChange(event)}
              value={step1Data.slot}
              error={!!errors.slot}
              helperText={errors.slot}
            >
              <MenuItem value={"manual"}>Manual</MenuItem>
              <MenuItem value={"random"}>Random</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default CreationStep1;
