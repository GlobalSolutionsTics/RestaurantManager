import { PayloadAction } from "@reduxjs/toolkit";
import { IOrderSlice } from "../slices/orders.slice";

export const setCreateTable = (
  state: IOrderSlice,
  action: PayloadAction<number>,
) => {
  state.tableNumber = action.payload;
};

export const setCreateDishesDescription = (
  state: IOrderSlice,
  action: PayloadAction<Array<any>>,
) => {
  state.dishesDescription = action.payload;
};

export const setCreateDishesNumber = (
  state: IOrderSlice,
  action: PayloadAction<number>,
) => {
  state.dishes = action.payload;
};

export const setCreateIdOrder = (
  state: IOrderSlice,
  action: PayloadAction<string>,
) => {
  state.id = action.payload;
};
