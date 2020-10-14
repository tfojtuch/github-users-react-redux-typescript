import React from "react";
import { useDispatch } from "react-redux";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

import { setUserLogin } from "../userDetails/userDetailsSlice";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      width: 320,
      height: 384,
      margin: theme.spacing(3),
    },
    media: {
      height: 320,
    },
  })
);

type UserCardProps = {
  login: string;
  url: string;
  avatarUrl: string;
};

export function UserCard(props: UserCardProps) {
  const dispatch = useDispatch();
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardActionArea onClick={() => dispatch(setUserLogin(props.login))}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {props.login}
          </Typography>
        </CardContent>
        <CardMedia
          className={classes.media}
          image={props.avatarUrl}
          title={props.login}
        />
      </CardActionArea>
    </Card>
  );
}
