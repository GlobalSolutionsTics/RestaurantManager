import { PayloadAction } from "@reduxjs/toolkit";
import { IOrderSlice } from "../slices/orders.slice";

export const setTable = (state: IOrderSlice, action: PayloadAction<number>) => {
  state.tableNumber = action.payload;
};
