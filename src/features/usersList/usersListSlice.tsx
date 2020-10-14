import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { client } from "client";
import { RootState } from "store";

type UsersList = {
  id: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  since: number;
  users: (
    | { id: number; login: string; avatar_url: string; url: string }
    | never
  )[];
};

type InitialState = {
  currentListId: number;
  items: {
    [index: number]: UsersList;
  };
};

const initialState: InitialState = {
  currentListId: 1,
  items: {
    "1": {
      id: 1,
      status: "idle",
      error: null,
      users: [],
      since: 0,
    },
  },
};

export const fetchUsersList = createAsyncThunk(
  "usersList/fetchUsersList",
  async (since: number) => {
    return await client.getUsersList(since);
  }
);

function resetUsersListState(usersList: UsersList): void {
  usersList.status = "idle";
  usersList.error = null;
  usersList.users = [];
}

export const usersListSlice = createSlice({
  name: "usersList",
  initialState,
  reducers: {
    incrementListId: (state) => {
      state.currentListId += 1;

      // resetting state if the list has not been successfully fetched so far:
      if (state.items[state.currentListId].status !== "succeeded") {
        resetUsersListState(state.items[state.currentListId]);
      }
    },
    decrementListId: (state) => {
      state.currentListId -= 1;

      // resetting state if the list has not been successfully fetched so far:
      if (state.items[state.currentListId].status !== "succeeded") {
        resetUsersListState(state.items[state.currentListId]);
      }
    },
    clearError: (state) => {
      resetUsersListState(state.items[state.currentListId]);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsersList.pending, (state) => {
      state.items[state.currentListId].status = "loading";
    });
    builder.addCase(fetchUsersList.fulfilled, (state, { payload }) => {
      const currentListId = state.currentListId;

      // updating current item with fetched data
      const currentList = state.items[currentListId];
      currentList.status = "succeeded";
      currentList.error = null;
      currentList.users = payload;

      // and adding the next item to the list for the next request
      //
      // taking since from the last element of the current list
      // the other option would be to parse Link Header to get the new url
      state.items[currentListId + 1] = {
        id: currentListId + 1,
        status: "idle",
        error: null,
        users: [],
        since: currentList.users[currentList.users.length - 1].id,
      };
    });
    builder.addCase(fetchUsersList.rejected, (state, action) => {
      state.items[state.currentListId].status = "failed";
      state.items[state.currentListId].error = JSON.stringify(action.error);
    });
  },
});

export default usersListSlice.reducer;

export const {
  incrementListId,
  decrementListId,
  clearError,
} = usersListSlice.actions;

export const getCurrentListId = (state: RootState) =>
  state.usersList.currentListId;
export const getCurrentList = (state: RootState) =>
  state.usersList.items[state.usersList.currentListId];
