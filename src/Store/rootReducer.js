import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
