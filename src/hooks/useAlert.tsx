import React from "react";
import { createPortal } from "react-dom";
import { AppAlert } from "../components/molecules/AppALert";
import { AlertColor } from "@mui/material/Alert";

export const useAlert = () => {
  const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false);
  const [alertConfig, setAlertConfig] = React.useState<PropsOpenAlert>({ contents: <></> });
  const ref = React.useRef<HTMLElement>();

  const openAlert = ({ contents, severity = "error" }: PropsOpenAlert) => {
    setAlertConfig({ contents, severity });
    setIsAlertOpen(true);
  };

  const closeAlert = () => setIsAlertOpen(false);

  const Alert = React.useCallback(() => {
    if (ref.current && isAlertOpen) {
      return createPortal(
        <AppAlert isOpen={isAlertOpen} closeAlert={closeAlert} severity={alertConfig.severity}>
          {alertConfig.contents}
        </AppAlert>,
        ref.current
      );
    }
    return <></>;
  }, [isAlertOpen, alertConfig]);

  React.useEffect(() => {
    const $modal = document.getElementById("root-alert")!;
    ref.current = $modal;
  }, []);

  return { openAlert, Alert };
};

type PropsOpenAlert = {
  contents: React.ReactNode;
  severity?: AlertColor;
};
