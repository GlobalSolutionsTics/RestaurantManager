import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  setTable as setTableNumber,
  setDishesDescription as setDishesDescAction,
  setDishesNumber as setDishesNumberAction,
  setIdOrder as setIdOrderAction,
} from "../reducers/orders.reducers";
import type { DishesWithOrder } from "@/pages/api/types/Order/order.type";

type TDish = Omit<DishesWithOrder, "number"> & {
  number?: number;
  image?: string;
};
export interface IOrderSlice {
  name: string;
  tableNumber: number;
  dishes: number;
  dishesDescription: Array<TDish>;
  id?: string;
}

type AdditionDraft = {
  orderId: string;
  submissionId: string;
  dishes: TDish[];
  submitted?: boolean;
  notes?: string;
};

const INITAL_STATE: IOrderSlice & { additionDraft?: AdditionDraft } = {
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
    resetComanda: () => INITAL_STATE,
    resetTableNumber: () => ({ ...INITAL_STATE, tableNumber: 0 }),
    setAdditionDraft: (state, action: PayloadAction<AdditionDraft>) => {
      state.additionDraft = action.payload;
    },
    clearAdditionDraft: (state, action: PayloadAction<string>) => {
      if (state.additionDraft?.submissionId === action.payload) {
        delete state.additionDraft;
      }
    },
    setTableOrder: setTableNumber,
    setDishesDescriptionRedux: setDishesDescAction,
    setDishesNumberRedux: setDishesNumberAction,
    setOrderIdRedux: setIdOrderAction,
  },
});

export const {
  resetComanda,
  setAdditionDraft,
  clearAdditionDraft,
  setTableOrder,
  setDishesDescriptionRedux,
  setDishesNumberRedux,
  setOrderIdRedux,
  resetTableNumber,
} = ordersSlice.actions;
export default ordersSlice.reducer;
