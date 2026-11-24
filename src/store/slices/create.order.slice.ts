import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IOrderSlice } from "./orders.slice";
import {
  setCreateTable as setTable,
  setCreateDishesDescription as setDishesDescription,
  setCreateDishesNumber as setDishesNumber,
  setCreateIdOrder as setIdOrder,
} from "../reducers/create.orders.reducers";

const INITIAL_STATE: IOrderSlice & { submissionKey?: string; notes?: string } =
  {
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
    setCreateSubmissionKeyRDX: (state, action: PayloadAction<string>) => {
      state.submissionKey = action.payload;
    },
    setCreateOrderNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },
    setCreateDishSelection: (
      state,
      action: PayloadAction<IOrderSlice["dishesDescription"]>,
    ) => {
      state.dishesDescription = action.payload;
      state.dishes = action.payload.reduce(
        (total, dish) => total + (dish.number ?? 0),
        0,
      );
    },
    setCreateTableRDX: setTable,
    setCreateIdOrderRDX: setIdOrder,
    setCreateDishesNumberRDX: setDishesNumber,
    setCreateDishesDescriptionRDX: setDishesDescription,
  },
});

export const {
  resetCreateCommanda,
  setCreateSubmissionKeyRDX,
  setCreateDishSelection,
  setCreateOrderNotes,
  setCreateTableRDX,
  setCreateIdOrderRDX,
  setCreateDishesNumberRDX,
  setCreateDishesDescriptionRDX,
} = createOrderSlice.actions;

export default createOrderSlice.reducer;
