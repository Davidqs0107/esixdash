import React from "react";
import Typography from "@mui/material/Typography";

interface IHeader {
  value: string;
  level: number;
  bold?: boolean;
  color?: string;
  pageTitle?: boolean;
  drawerTitle?: boolean;
  marginTop?: number | undefined;
  className?: string;
  fontWeight?: number;
}
const Header: React.FC<IHeader> = ({
  value,
  level,
  bold,
  color,
  pageTitle,
  drawerTitle,
  marginTop,
  fontWeight,
}) => {
  const tagName = `h${level}`;

  const getColor = () => {
    switch (color) {
      case "primary":
        return "#152C5B";
      case "white":
        return "#FFFFFF";
      default:
        return "#000000";
    }
  };

  return (
    <Typography
      variant={tagName as any}
      color={getColor()}
      sx={{
        fontWeight: bold ? 600 : fontWeight || 400,
        marginTop: drawerTitle
          ? marginTop !== undefined
            ? marginTop
            : "30px"
          : 0,
        marginBottom: pageTitle ? "70px" : drawerTitle ? "46px" : 0,
      }}
    >
      {value}
    </Typography>
  );
};

export default Header;
