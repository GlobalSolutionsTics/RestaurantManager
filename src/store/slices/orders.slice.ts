import { createSlice } from "@reduxjs/toolkit";
import { setTable as setTableNumber } from "../reducers/orders.reducers";

export interface IOrderSlice {
  name: string;
  tableNumber: number;
  dishes: number;
  dishesDescription: Array<any>;
}

const INITAL_STATE: IOrderSlice = {
  name: "",
  tableNumber: 0,
  dishes: 0,
  dishesDescription: [],
};

const ordersSlice = createSlice({
  name: "ordersDishes",
  initialState: INITAL_STATE,
  reducers: {
    reset: () => INITAL_STATE,
    setTableOrder: setTableNumber,
  },
});

export const { reset, setTableOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
