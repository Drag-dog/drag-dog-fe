import React from "react";
import { Modal as MuiModal } from "@mui/material";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import loading from "../assets/gif/dragDog.gif";
import { Empty } from "../components/atoms";

export const useLoading = () => {
  const Loading = () => {
    return (
      <MuiModal open={true}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            p: 4,
            backdropFilter: "blur(4px)",
            boxShadow: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">로딩중</Typography>
            <Empty height="1rem" />
            <img src={loading} alt="로딩" style={{ width: "50%" }} />
          </div>
        </Box>
      </MuiModal>
    );
  };

  return { Loading };
};
