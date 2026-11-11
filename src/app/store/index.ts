import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { signaturesReducer } from "../../entities/isotopic-signature";
import { userReducer } from "../../entities/user";

export const store = configureStore({
  reducer: combineReducers({
    signatures: signaturesReducer,
    user: userReducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
