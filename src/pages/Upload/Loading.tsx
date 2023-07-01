import React from "react";
import { Typography } from "@mui/material";
// import loadingDog from "../../assets/loading.png";
import LoadingCup from "../../assets/gif/loading.gif";
import { Empty } from "../../components/atoms";

export const LoadingComponent = () => {
  return (
    <>
      <Typography>사업 계획서를 작성하는 중입니다</Typography>
      <Typography>잠시만 기다려주세요!</Typography>
      <Empty height="2rem" />
      <img
        src={LoadingCup}
        alt="loading"
        style={{
          width: "50%",
        }}
      />
    </>
  );
};
