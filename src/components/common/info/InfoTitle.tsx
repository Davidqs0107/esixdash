import React from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  infoTitle: {
    color: "#73809D",
    fontSize: "8px",
    letterSpacing: "-0.2px",
    lineHeight: "10px",
    height: "12px",
    fontWeight: 400,
  },
});

const InfoTitle = ({ className, children, ...props }: TypographyProps) => {
  const classes = useStyles();

  return (
    <Typography
      variant={"h6"}
      className={className ? className : classes.infoTitle}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default InfoTitle;
