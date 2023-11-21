import { PayloadAction } from "@reduxjs/toolkit";
import { IOrderSlice } from "../slices/orders.slice";

export const setTable = (state: IOrderSlice, action: PayloadAction<number>) => {
  state.tableNumber = action.payload;
};

export const setDishesDescription = (
  state: IOrderSlice,
  action: PayloadAction<Array<any>>,
) => {
  state.dishesDescription = action.payload;
};

export const setDishesNumber = (
  state: IOrderSlice,
  action: PayloadAction<number>,
) => {
  state.dishes = action.payload;
};

export const setIdOrder = (
  state: IOrderSlice,
  action: PayloadAction<string>,
) => {
  state.id = action.payload;
};
