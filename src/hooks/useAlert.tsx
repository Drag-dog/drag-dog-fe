import React from "react";
import { createPortal } from "react-dom";
import { AppAlert } from "../components/molecules/AppALert";
import { AlertColor } from "@mui/material/Alert";

export const useAlert = () => {
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const ref = React.useRef<HTMLElement>();

  const openAlert = () => setIsAlertOpen(true);
  const closeAlert = () => setIsAlertOpen(false);

  const Alert = React.useCallback(
    ({ children, severity = "error" }: { children: React.ReactNode; severity?: AlertColor }) => {
      if (ref.current && isAlertOpen) {
        return createPortal(
          <AppAlert isOpen={isAlertOpen} closeAlert={closeAlert} severity={severity}>
            {children}
          </AppAlert>,
          ref.current
        );
      }
      return <></>;
    },
    [isAlertOpen]
  );

  React.useEffect(() => {
    const $modal = document.getElementById("root-alert")!;
    ref.current = $modal;
  }, []);

  return { openAlert, Alert };
};
