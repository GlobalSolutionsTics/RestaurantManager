import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import ordersReducer from "./slices/orders.slice";
import userReducer from "./slices/user.slice";
interface RootState {
  counter: number;
}

const store = configureStore({
  reducer: {
    counter: counterReducer,
    ordersDishes: ordersReducer,
    user: userReducer,
  },
});

export default store;
