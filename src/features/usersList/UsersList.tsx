import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import { Loading } from "features/loader/Loading";
import { Error } from "features/error/Error";
import { UserCard } from "./UserCard";
import { Pagination } from "./Pagination";
import { useTypedSelector } from "store";
import { getCurrentList, fetchUsersList, clearError } from "./usersListSlice";

const useStyles = makeStyles({
  button: {
    width: 100,
    margin: 20,
  },
});

export function UsersList() {
  const dispatch = useDispatch();
  const currentList = useTypedSelector(getCurrentList);
  const classes = useStyles();

  useEffect(() => {
    if (currentList.status === "idle") {
      dispatch(fetchUsersList(currentList.since));
    }
  }, [currentList, dispatch]);

  if (currentList.status === "loading") {
    return <Loading />;
  } else if (currentList.status === "succeeded") {
    return (
      <>
        <Grid container={true} justify="space-around">
          {currentList.users.map((user) => (
            <Grid key={user.id} item>
              <UserCard
                login={user.login}
                url={user.url}
                avatarUrl={user.avatar_url}
              />
            </Grid>
          ))}
        </Grid>
        <Pagination />
      </>
    );
  } else {
    return (
      <>
        <Error errorMessage={currentList.error} />;
        <Button
          className={classes.button}
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => {
            dispatch(clearError());
          }}
        >
          RETRY
        </Button>
      </>
    );
  }
}
