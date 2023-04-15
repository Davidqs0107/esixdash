import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { IButtonBase } from "./IButton";
import RequireAtLeastOne from "../../util/RequireAtLeastOne";

interface IButtonExtended extends IButtonBase {
  /**
   * If `true`, no elevation is used.
   */
  disableElevation?: boolean;
  /**
   * If `true`, the  keyboard focus ripple will be disabled.
   */
  disableFocusRipple?: boolean;
  /**
   * Element placed after the children.
   */
  endIcon?: React.ReactNode;
  /**
   * If `true`, the button will take up the full width of its container.
   */
  fullWidth?: boolean;
  /**
   * The URL to link to when the button is clicked.
   * If defined, an `a` element will be used as the root node.
   */
  href?: string;
  /**
   * Element placed before the children.
   */
  startIcon?: React.ReactNode;

  textCase?: "upper" | "provided";
}

type QDButtonProps = RequireAtLeastOne<IButtonExtended>;

const BootstrapButton = styled(Button)({
  "&.MuiButton-containedSecondary": {
    color: "#FFFFFF",
    fontSize: "10px",
    fontWeight: "bold",
    lineHeight: "13px",
    borderRadius: "12.5px",
    backgroundColor: "#7F7CAD",
  },
  "&.MuiButton-textInfo": {
    color: "#8995AD",
    fontSize: "12px",
    lineHeight: "15px",
    backgroundColor: "transparent",
    fontWeight: "500",
    padding: "0px",
  },
  "&.MuiButton-text.MuiButton-textSecondary:hover": {
    color: "#FFFFFF",
    opacity: 0.8,
  },
  "&.MuiButton-containedSizeLarge": {
    padding: "9px 20px 10px",
    fontSize: "14px",
    borderRadius: "22px",
    lineHeight: "17px",
    fontWeight: "400",
  },
  "&.MuiButton-containedSizeSmall": {
    padding: "4px 10px",
    fontSize: "10px",
    fontWeight: 600,
    lineHeight: "12px",
    borderRadius: "12.5px",
  },
});

const BootstrapIconButton = styled(IconButton)({
  "&.iconButton": {
    backgroundColor: "#433aa8",
    marginLeft: "2px",
    padding: "12px",
    fontSize: "1.5rem",
    textAlign: "center",
    borderRadius: "50%"
  }
});

const QDButton: React.FC<QDButtonProps> = ({
  children,
  color,
  href,
  disabled,
  label,
  variant,
  type,
  className,
  onClick,
  style = {},
  id,
  name,
  size,
  key,
  textCase = "none",
  fullWidth = false,
}) => {
  const deriveButtonClassName = () => {
    let buttonClassName = "";
    if (className !== undefined) {
      // shame- kind of a hack, needed currently for Submit and Cancel buttons to sit right
      //    (removing overridden display: contents for the button specifically, interferes with ripple)
      buttonClassName = className;
    }

    if (variant === "text" && color === "secondary") {
      buttonClassName += ` MuiButton-textSecondary`;
    }
    if (variant === "text" && color === "info") {
      buttonClassName += ` MuiButton-textInfo`;
    }
    if (size === "extra-tall") {
      buttonClassName += " MuiButton-extra-tall";
    }
    return buttonClassName;
  };

  const appliedStyle = style;
  if (textCase === "upper") {
    appliedStyle.textTransform = "uppercase";
  }

  const getMuiSafeSize = (
    providedSize: "small" | "medium" | "large" | "extra-tall" | undefined
  ) => {
    if (providedSize === "extra-tall") {
      return "large";
    }
    return providedSize;
  };

  return (
    <Box className={className}>
      {variant !== "icon" ? (
        <BootstrapButton
          name={name}
          variant={variant}
          key={key}
          color={color}
          disabled={disabled}
          href={href}
          className={deriveButtonClassName()}
          onClick={onClick}
          style={appliedStyle}
          type={type}
          id={id}
          size={getMuiSafeSize(size)}
          fullWidth={fullWidth}
          disableRipple={variant === "text"}
        >
          {children !== undefined ? children : label}
        </BootstrapButton>
      ) : (
        <BootstrapIconButton
          id={id}
          name={name}
          key={key}
          color={color}
          disabled={disabled}
          className={deriveButtonClassName()}
          onClick={onClick}
          disableRipple
          sx={{
            paddingLeft: 0,
          }}
        >
          {children}
        </BootstrapIconButton>
      )}
    </Box>
  );
};

export default QDButton;
