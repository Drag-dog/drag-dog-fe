import { Button } from "@mui/material";
import { ButtonProps } from "@mui/material";

export const MainCtaBtn = ({ ...props }: ButtonProps) => {
  return (
    <Button variant="contained" sx={{ width: 300, height: 50 }} {...props}>
      {props.children}
    </Button>
  );
};
