import React from "react";
import Typography from "@mui/material/Typography";

function Logo(props: Record<string, unknown>) {
  return (
    <Typography variant="h3" textAlign="center" {...props}>
      Please Wait...
    </Typography>
  );
}

export default Logo;
