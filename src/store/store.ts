import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";

interface RootState {
  counter: number;
}

const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export default store;
