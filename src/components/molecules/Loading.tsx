import React from "react";
import { appColor } from "../../constants/appColor";
import loading from "../../assets/apng/3D Text-1s-270px.png";

export const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: appColor.greyTransparent,
      }}
    >
      <img src={loading} alt="로딩" />
    </div>
  );
};
