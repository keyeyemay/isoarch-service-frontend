import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

export interface UserState {
  username: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  username: "",
  isAuthenticated: false,
};

interface StateWithUser {
  user: UserState;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<{ username: string }>) {
      state.username = payload.username;
      state.isAuthenticated = true;
    },
    resetUser() {
      return initialState;
    },
  },
});

export const useIsAuthenticated = () =>
  useSelector((state: StateWithUser) => state.user.isAuthenticated);

export const useUsername = () => useSelector((state: StateWithUser) => state.user.username);

export const { setUser: setUserAction, resetUser: resetUserAction } = userSlice.actions;

export default userSlice.reducer;
