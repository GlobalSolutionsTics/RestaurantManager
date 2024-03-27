import { createSlice } from "@reduxjs/toolkit";
import { IOrderSlice } from "./orders.slice";
import {
  setCreateTable as setTable,
  setCreateDishesDescription as setDishesDescription,
  setCreateDishesNumber as setDishesNumber,
  setCreateIdOrder as setIdOrder,
} from "../reducers/create.orders.reducers";

const INITIAL_STATE: IOrderSlice = {
  name: "",
  tableNumber: 0,
  dishes: 0,
  dishesDescription: [],
  id: "",
};

const createOrderSlice = createSlice({
  name: "ordersCreate",
  initialState: INITIAL_STATE,
  reducers: {
    resetCreateCommanda: () => INITIAL_STATE,
    setCreateTableRDX: setTable,
    setCreateIdOrderRDX: setIdOrder,
    setCreateDishesNumberRDX: setDishesNumber,
    setCreateDishesDescriptionRDX: setDishesDescription,
  },
});

export const {
  resetCreateCommanda,
  setCreateTableRDX,
  setCreateIdOrderRDX,
  setCreateDishesNumberRDX,
  setCreateDishesDescriptionRDX,
} = createOrderSlice.actions;

export default createOrderSlice.reducer;
