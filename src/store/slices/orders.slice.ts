import { createSlice } from "@reduxjs/toolkit";
import {
  setTable as setTableNumber,
  setDishesDescription as setDishesDescAction,
  setDishesNumber as setDishesNumberAction,
  setIdOrder as setIdOrderAction,
  setIdWaiter as setIdWaiterAction,
} from "../reducers/orders.reducers";

export interface IOrderSlice {
  name: string;
  tableNumber: number;
  dishes: number;
  dishesDescription: Array<any>;
  id?: string;
  waiter?: string;
}

const INITAL_STATE: IOrderSlice = {
  name: "",
  tableNumber: 0,
  dishes: 0,
  dishesDescription: [],
  id: "",
  waiter: "",
};

const ordersSlice = createSlice({
  name: "ordersDishes",
  initialState: INITAL_STATE,
  reducers: {
    reset: () => INITAL_STATE,
    setTableOrder: setTableNumber,
    setDishesDescriptionRedux: setDishesDescAction,
    setDishesNumberRedux: setDishesNumberAction,
    setOrderIdRedux: setIdOrderAction,
    setIdWaiterRedux: setIdWaiterAction,
  },
});

export const {
  reset,
  setTableOrder,
  setDishesDescriptionRedux,
  setDishesNumberRedux,
  setOrderIdRedux,
  setIdWaiterRedux,
} = ordersSlice.actions;
export default ordersSlice.reducer;
