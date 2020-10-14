import React from "react";
import Typography from "@material-ui/core/Typography";

type ErrorProps = {
  errorMessage: string | null;
};
export function Error(props: ErrorProps) {
  return (
    <>
      <Typography color="error" variant="h4">
        Error occured
      </Typography>
      {props.errorMessage && (
        <Typography variant="body1">
          {" Error message: " + props.errorMessage}
        </Typography>
      )}
    </>
  );
}
