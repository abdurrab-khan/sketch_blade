import { User } from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";

const initialState: User = {
  _id: "",
  name: "",
  email: "",
  clerkId: "",
};

export const authSlice = createSlice({
  name: "slice",
  initialState,
  reducers: {
    addUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    getUser: (state) => {
      return state;
    },
  },
});

export const { addUser, getUser } = authSlice.actions;
export default authSlice.reducer;
