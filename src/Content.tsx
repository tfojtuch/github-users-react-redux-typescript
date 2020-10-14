import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import { useTypedSelector } from "store";
import { UsersList } from "features/usersList/UsersList";
import { UserDetails } from "features/userDetails/UserDetails";
import { getCurrentUserLogin } from "features/userDetails/userDetailsSlice";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

export function Content() {
  const classes = useStyles();
  const currentUserLogin = useTypedSelector(getCurrentUserLogin);

  return (
    <Container component="main" className={classes.content}>
      {currentUserLogin === null ? (
        <UsersList />
      ) : (
        <UserDetails login={currentUserLogin} />
      )}
    </Container>
  );
}
