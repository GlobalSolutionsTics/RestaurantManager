import { PayloadAction } from "@reduxjs/toolkit";
import { IUserRedux } from "../slices/user.slice";

export const saveUserInRedux = (
  state: IUserRedux,
  action: PayloadAction<IUserRedux>,
) => {
  state.name = action.payload.name;
  state.type = action.payload.type;
  state.uuid = action.payload.uuid;
  state.kitchenType = action.payload.kitchenType;
};
