import { createSlice } from "@reduxjs/toolkit";
import { saveUserInRedux as saveUser } from "../reducers/user.reducers";

export interface IUserRedux {
  type: string;
  name: string;
  uuid: string;
  kitchenType?: string;
}

const INITIAL_STATE: IUserRedux = {
  type: "",
  name: "",
  uuid: "",
};

const userSlicer = createSlice({
  initialState: INITIAL_STATE,
  name: "user",
  reducers: {
    resetUserRedux: () => INITIAL_STATE,
    saveUserInRedux: saveUser,
  },
});

export const { resetUserRedux, saveUserInRedux } = userSlicer.actions;
export default userSlicer.reducer;
