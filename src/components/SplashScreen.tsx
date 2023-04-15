import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Logo from "./Logo";

const Container = styled(Box)(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.palette.background.default,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  justifyContent: "center",
  left: 0,
  padding: theme.spacing(3),
  position: "fixed",
  top: 0,
  width: "100%",
  zIndex: 2000,
  "& .Logo": {
    width: 200,
    maxWidth: "100%",
  },
}));

function SplashScreen() {
  return (
    <Container>
      <Box display="flex" justifyContent="center" mb={6}>
        <Logo className="Logo" />
      </Box>
      <CircularProgress />
    </Container>
  );
}

export default SplashScreen;
