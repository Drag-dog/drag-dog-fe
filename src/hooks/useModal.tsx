import React from "react";
import { Modal as MuiModal } from "@mui/material";
import { Box } from "@mui/system";
import { sizes } from "../constants/sizes";

export const useModal = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const Modal = ({ children }: { children: React.ReactNode }) => {
    return (
      <MuiModal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "80%",
            maxWidth: sizes.pageMaxWidth,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            overflow: "scroll",
            "&::-webkit-scrollbar": {
              width: "0",
            },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {children}
        </Box>
      </MuiModal>
    );
  };

  return { handleOpen, handleClose, Modal };
};
