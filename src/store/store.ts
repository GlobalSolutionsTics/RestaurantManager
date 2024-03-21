import { configureStore } from "@reduxjs/toolkit";
import ordersCreateReducer from "./slices/create.order.slice";
import counterReducer from "./slices/counterSlice";
import ordersReducer from "./slices/orders.slice";
import userReducer from "./slices/user.slice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    ordersDishes: ordersReducer,
    orderCreate: ordersCreateReducer,
    user: userReducer,
  },
});

export type RootRedux = ReturnType<typeof store.getState>;

export default store;
