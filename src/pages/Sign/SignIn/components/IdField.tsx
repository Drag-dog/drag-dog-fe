import React from "react";
import { InputAdornment, IconButton } from "@mui/material";
import { TextFieldControlled as Input } from "../../../../components/molecules";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { UseFormSetValue, FieldValues, UseControllerProps } from "react-hook-form";

type Prop<TFieldValues extends FieldValues = FieldValues> = {
  useControllerProps: UseControllerProps;
  setValue: UseFormSetValue<TFieldValues>;
};

export const IdField = ({ useControllerProps, setValue }: Prop) => {
  const [isMouseEnter, setIsMouseEnter] = React.useState(false);

  return (
    <Input
      label="ID"
      type="email"
      useControllerProps={useControllerProps}
      fullWidth
      onMouseEnter={() => setIsMouseEnter(true)}
      onMouseLeave={() => setIsMouseEnter(false)}
      InputProps={{
        endAdornment: isMouseEnter && (
          <InputAdornment position="end">
            <IconButton onClick={() => setValue(useControllerProps.name, "")}>
              <HighlightOffIcon color="primary" />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
