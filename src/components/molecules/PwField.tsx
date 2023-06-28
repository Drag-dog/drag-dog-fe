import React from "react";
import { InputAdornment, IconButton } from "@mui/material";
import { TextFieldControlled as Input, ControlledMuiProps } from "./TextFieldControlled";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export const PwField = ({ useControllerProps, ...props }: ControlledMuiProps) => {
  const [isMouseEnter, setIsMouseEnter] = React.useState(false);
  const [isMouseDown, setIsMouseDown] = React.useState(false);
  return (
    <Input
      useControllerProps={useControllerProps}
      label={props.label || "PASSWORD"}
      type={isMouseDown ? "text" : "password"}
      fullWidth={props.fullWidth === undefined && true}
      onMouseEnter={() => setIsMouseEnter(true)}
      onMouseLeave={() => setIsMouseEnter(false)}
      InputProps={{
        endAdornment: isMouseEnter && (
          <InputAdornment position="end">
            <IconButton
              onMouseDown={() => setIsMouseDown(true)}
              onMouseUp={() => setIsMouseDown(false)}
            >
              {isMouseDown ? (
                <VisibilityIcon color="primary" />
              ) : (
                <VisibilityOffIcon color="primary" />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};
