import React from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  infoContent: {
    color: "#152C5B",
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "15px",
    height: "15px",
  },
});

const InfoContent = ({ className, children, ...props }: TypographyProps) => {
  const classes = useStyles();
  return (
    <Typography
      {...props}
      className={className ? className : classes.infoContent}
    >
      {children}
    </Typography>
  );
};

export default InfoContent;
