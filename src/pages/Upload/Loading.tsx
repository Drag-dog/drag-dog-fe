import React from "react";
import { Typography } from "@mui/material";
import loadingDog from "../../assets/loading.png";

export const LoadingComponent = () => {
  return (
    <>
      <Typography>사업 계획서를 작성하는 중입니다</Typography>
      <Typography>잠시만 기다려주세요!</Typography>
      <img
        src={loadingDog}
        alt="loading"
        style={{
          width: "50%",
        }}
      />
    </>
  );
};
