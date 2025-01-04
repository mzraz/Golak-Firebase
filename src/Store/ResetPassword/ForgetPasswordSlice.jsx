import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp, fireStore } from "../../Firebase/Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const initialState = {
  loading: false,
  isLogged: false,
  accessToken: "",
  user: null,
};

export const fogetPasswordSlice = createAsyncThunk(
  "resetPassword",
  async (data, thunkAPI) => {
    try {
      const auth = getAuth(firebaseApp);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      const accessToken = await user.getIdToken();
      const usersCollectionRef = collection(fireStore, "Admins");
      const q = query(usersCollectionRef, where("email", "==", data.email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const id = querySnapshot.docs[0].id;

        return { user: { ...userData, id: id }, accessToken };
      } else {
        return thunkAPI.rejectWithValue({
          statusCode: 404,
          errors: "User not found in database",
        });
      }
    } catch (err) {
      return thunkAPI.rejectWithValue({
        statusCode: err?.code,
        errors: err?.message,
      });
    }
  }
);

const authSlice = createSlice({
  name: "resetPassword",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fogetPasswordSlice.fulfilled, (state, action) => {
        state.isLogged = true;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(fogetPasswordSlice.rejected, (state, action) => {
        state.isLogged = false;
      });
  },
});

export const { logout, userDataUpdate } = authSlice.actions;

export const initialAuth = (state) => state.auth;

export default authSlice.reducer;
