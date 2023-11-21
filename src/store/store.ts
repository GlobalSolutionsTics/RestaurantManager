import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import ordersSlice from "./slices/orders.slice";
interface RootState {
  counter: number;
}

const store = configureStore({
  reducer: {
    counter: counterReducer,
    ordersDishes: ordersSlice,
  },
});

export default store;
