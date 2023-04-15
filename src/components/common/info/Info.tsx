import React from 'react';
import {Box, BoxProps} from "@mui/material";

const Info = ({
  children,
  ...props
}: BoxProps) => {
  return (
    <Box {...props}>
      {children}
    </Box>
  );
};

export default Info;
