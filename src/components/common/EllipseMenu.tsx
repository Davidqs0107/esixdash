import React from "react";
import { withStyles } from "@mui/styles";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import Grid from "@mui/material/Grid";
import Icon from "./Icon";

interface EllipseMenuProps {
  children?: React.ReactNode[] | React.ReactElement;
}

interface OriginProps {
  anchorOriginVertical: number | "top" | "center" | "bottom";
  anchorOriginHorizontal: number | "center" | "left" | "right";
  transformOriginVertical: number | "top" | "center" | "bottom";
  transformOriginHorizontal: number | "center" | "left" | "right";
  separatorOnLastItem?: boolean;
  icon?: "faEllipsisH" | "faEllipsisV";
}

type MenuCombinedProps = MenuProps & OriginProps;
type EllipseMenuCombinedProps = EllipseMenuProps & OriginProps;

// @ts-ignore
const StyledMenu = withStyles({
  paper: {
    backgroundColor: "transparent",
    width: "300px",
    height: "initial !important",
    opacity: 0.1,
    "& .SeparatorOnLastItem li:last-child": {
      borderTop: "1px solid rgb(33 31 64 / 4%)",
    },
  },
})((Props: MenuCombinedProps) => (
  <Menu
    elevation={0}
    // @ts-ignore
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: Props.anchorOriginVertical,
      horizontal: Props.anchorOriginHorizontal,
    }}
    transformOrigin={{
      vertical: Props.transformOriginVertical,
      horizontal: Props.transformOriginHorizontal,
    }}
    {...Props}
  />
));

// @ts-ignore
const StyledMenuItem = withStyles((theme) => ({
  root: {
    width: "100%",
    "&.MuiMenuItem-root": {
      paddingRight: 0,
    },
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      opacity: 0.1,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
        opacity: 0.1,
      },
    },
    "& .MuiMenuItem-delete > button:not(.Mui-disabled)": {
      width: "100%",
      color: theme.palette.error.main,
    },
    "& .MuiButton-root": {
      width: "100%",
      justifyContent: "flex-start",
      height: "48px",
    },
  },
}))(MenuItem);

const EllipseMenu: React.FC<EllipseMenuCombinedProps> = ({ ...props }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getIcon = () => {
    if (props.icon === "faEllipsisV") {
      return faEllipsisV;
    }
    return faEllipsisH;
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
      >
        <FontAwesomeIcon icon={getIcon()} color="#152C5B" />
      </IconButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOriginVertical={props.anchorOriginVertical}
        anchorOriginHorizontal={props.anchorOriginHorizontal}
        transformOriginVertical={props.transformOriginVertical}
        transformOriginHorizontal={props.transformOriginHorizontal}
      >
        <Grid
          container
          spacing={1}
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid
            item
            spacing={1}
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            xs={10}
            md={10}
            lg={10}
            style={{
              backgroundColor: "white",
              width: "100%",
              padding: "2px",
              borderRadius: "9px",
              boxShadow: "0 20px 20px -10px rgba(33, 31, 64, 0.2)",
            }}
            className={props.separatorOnLastItem ? `SeparatorOnLastItem` : ``}
          >
            {props.children instanceof Array &&
              props.children?.map((menuComponent: any) => {
                if (!menuComponent) return;
                return (
                  <StyledMenuItem onClick={handleClose}>
                    <div style={{ width: "100%" }}> {menuComponent}</div>
                  </StyledMenuItem>
                );
              })}
            {!(props.children instanceof Array) && (
              <StyledMenuItem onClick={handleClose}>
                <div style={{ width: "100%" }}> {props.children}</div>
              </StyledMenuItem>
            )}
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClose}
              size="small"
            >
              <img
                width={23}
                height={23}
                src={Icon.deleteIcon}
                alt="Delete Icon"
              />
            </IconButton>
          </Grid>
        </Grid>
      </StyledMenu>
    </>
  );
};
export default EllipseMenu;
