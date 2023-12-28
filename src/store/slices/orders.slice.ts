import { createSlice } from "@reduxjs/toolkit";
import {
  setTable as setTableNumber,
  setDishesDescription as setDishesDescAction,
  setDishesNumber as setDishesNumberAction,
  setIdOrder as setIdOrderAction,
} from "../reducers/orders.reducers";
import { TMenuResponse } from "@/types/menu.types";

type TDish = TMenuResponse & { number?: number; image?: string };
export interface IOrderSlice {
  name: string;
  tableNumber: number;
  dishes: number;
  dishesDescription: Array<TDish>;
  id?: string;
}

const INITAL_STATE: IOrderSlice = {
  name: "",
  tableNumber: 0,
  dishes: 0,
  dishesDescription: [],
  id: "",
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
  },
});

export const {
  reset,
  setTableOrder,
  setDishesDescriptionRedux,
  setDishesNumberRedux,
  setOrderIdRedux,
} = ordersSlice.actions;
export default ordersSlice.reducer;
