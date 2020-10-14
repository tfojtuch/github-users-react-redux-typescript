import React from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { useTypedSelector } from "store";
import {
  incrementListId,
  decrementListId,
  getCurrentListId,
} from "./usersListSlice";

const useStyles = makeStyles({
  button: {
    width: 100,
  },
  pageNumber: {
    fontSize: 16,
  },
});

export function Pagination() {
  const dispatch = useDispatch();
  const currentId = useTypedSelector(getCurrentListId);
  const classes = useStyles();

  return (
    <Grid container direction="row" justify="space-around" alignItems="center">
      <Button
        className={classes.button}
        variant="outlined"
        color="primary"
        size="large"
        onClick={() => dispatch(decrementListId())}
        disabled={currentId <= 1}
      >
        PREVIOUS
      </Button>
      <Typography
        className={classes.pageNumber}
        variant="caption"
        color="primary"
      >
        {currentId}
      </Typography>
      <Button
        className={classes.button}
        variant="outlined"
        color="primary"
        size="large"
        onClick={() => dispatch(incrementListId())}
      >
        NEXT
      </Button>
    </Grid>
  );
}
