import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { client } from "client";
import { RootState } from "store";

type UserDetails = {
  login: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  userDetails: {
    [index: string]: string;
  } | null;
};

type InitialState = {
  currentUserLogin: string | null;
  items: {
    [index: string]: UserDetails;
  };
};

const initialState: InitialState = {
  currentUserLogin: null,
  items: {},
};

export const fetchUserDetails = createAsyncThunk(
  "userDetails/fetchUserDetails",
  async (login: string) => {
    return await client.getUserDetails(login);
  }
);

function assertLoginIsString(
  currentUserLogin: string | null
): asserts currentUserLogin is string {
  if (currentUserLogin === null) {
    throw Error("currentUserLogin is null");
  }
}

function resetUserDetailsState(usersList: UserDetails): void {
  usersList.status = "idle";
  usersList.error = null;
  usersList.userDetails = null;
}

export const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    setUserLogin: (state, action) => {
      const userLogin = action.payload;
      state.currentUserLogin = userLogin;

      // if userDetails item for userLogin does not exist add one with default values
      if (state.items[userLogin] === undefined) {
        state.items[userLogin] = {
          login: userLogin,
          status: "idle",
          error: null,
          userDetails: null,
        };
      }

      // resetting state if userDetails have not been successfully fetched so far:
      if (state.items[userLogin].status !== "succeeded") {
        resetUserDetailsState(state.items[userLogin]);
      }
    },
    unsetUserLogin: (state) => {
      state.currentUserLogin = null;
    },
    clearError: (state) => {
      if (state.currentUserLogin !== null) {
        resetUserDetailsState(state.items[state.currentUserLogin]);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserDetails.pending, (state) => {
      assertLoginIsString(state.currentUserLogin);

      state.items[state.currentUserLogin].status = "loading";
    });
    builder.addCase(fetchUserDetails.fulfilled, (state, { payload }) => {
      assertLoginIsString(state.currentUserLogin);
      const currentUserLogin = state.currentUserLogin;

      // updating current item with fetched data
      const currentUser = state.items[currentUserLogin];
      currentUser.status = "succeeded";
      currentUser.error = null;
      currentUser.userDetails = payload;
    });
    builder.addCase(fetchUserDetails.rejected, (state, action) => {
      assertLoginIsString(state.currentUserLogin);

      state.items[state.currentUserLogin].status = "failed";
      state.items[state.currentUserLogin].error = JSON.stringify(action.error);
    });
  },
});

export default userDetailsSlice.reducer;

export const {
  setUserLogin,
  unsetUserLogin,
  clearError,
} = userDetailsSlice.actions;

export const getCurrentUserLogin = (state: RootState) =>
  state.userDetails.currentUserLogin;
export const getCurrentUser = (state: RootState, login: string) => {
  return state.userDetails.items[login];
};
