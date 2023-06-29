import React from "react";
import { SlideProps, Snackbar, Alert, AlertColor, Slide } from "@mui/material";

type Props = {
  children?: React.ReactNode;
  isOpen: boolean;
  closeAlert: () => void;
  severity?: AlertColor;
};

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

// [Todo] AppAlert 확장할 일 있다면 Snackbar Alert 기존 props 받게 하기
export const AppAlert = ({ children, isOpen, closeAlert, severity }: Props) => {
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      onClose={closeAlert}
      TransitionComponent={SlideTransition}
    >
      <Alert variant="filled" severity={severity} onClose={closeAlert}>
        {children}
      </Alert>
    </Snackbar>
  );
};
