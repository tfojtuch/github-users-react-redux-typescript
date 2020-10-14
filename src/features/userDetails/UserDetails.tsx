import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";

import { Loading } from "features/loader/Loading";
import { Error } from "features/error/Error";
import { useTypedSelector } from "store";
import {
  unsetUserLogin,
  getCurrentUser,
  clearError,
  fetchUserDetails,
} from "./userDetailsSlice";

const useStyles = makeStyles({
  header: { margin: 20 },
  button: {
    width: 100,
    margin: 20,
  },
});

type UserDetailsProps = {
  login: string;
};

export function UserDetails(props: UserDetailsProps) {
  const dispatch = useDispatch();
  const currentUser = useTypedSelector((state) =>
    getCurrentUser(state, props.login)
  );
  const classes = useStyles();

  useEffect(() => {
    if (currentUser.status === "idle") {
      dispatch(fetchUserDetails(currentUser.login));
    }
  }, [currentUser, dispatch]);

  const userDetails = currentUser.userDetails
    ? Object.entries(currentUser.userDetails)
    : null;

  if (currentUser.status === "loading") {
    return <Loading />;
  } else if (currentUser.status === "succeeded") {
    return (
      <>
        <Typography className={classes.header} variant="h3">
          {props.login}
        </Typography>
        {userDetails && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Field</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userDetails.map((row) => (
                <TableRow key={row[0]}>
                  <TableCell component="th" scope="row">
                    {row[0]}
                  </TableCell>
                  <TableCell>{row[1]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Button
          className={classes.button}
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => dispatch(unsetUserLogin())}
        >
          BACK
        </Button>
      </>
    );
  } else {
    return (
      <>
        <Error errorMessage={currentUser.error} />;
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
