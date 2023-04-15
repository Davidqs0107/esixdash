import React, { useEffect, ReactNode } from "react";
import NProgress from "nprogress";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";

const LoadingContainer = styled(Box)(({ theme }) => ({
  alignItems: "center",
  backgroundColor: "rgb(247, 250, 255)",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  justifyContent: "center",
  minHeight: "100%",
  padding: theme.spacing(3),
}));

interface ILoadingScreen {
  children?: ReactNode;
}

const LoadingScreen: React.FC<ILoadingScreen> = ({}) => {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <LoadingContainer>
      <Box width={400}>
        <LinearProgress />
      </Box>
    </LoadingContainer>
  );
};

export default LoadingScreen;
