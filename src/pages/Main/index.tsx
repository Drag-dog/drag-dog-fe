import React from "react";
import { PageLayout } from "../../components/layouts/PageLayout";
import { Typography } from "@mui/material";
import { MainCtaBtn } from "../../components/molecules/MainCtaBtn";
import { Empty } from "../../components/atoms";
import mainAsset1 from "../../assets/main-asset1.jpeg";
import mainAsset2 from "../../assets/main-asset2.jpeg";
import { useNavigate } from "react-router-dom";
import dragDog from "../../assets/dragDog.jpeg";

export const Main = () => {
  const navigate = useNavigate();
  return (
    <PageLayout>
      <PageLayout.Title />
      <PageLayout.Body>
        <Typography variant="h4">GPT를 이용한 사업계획서 생성 서비스</Typography>
        <Empty height="1rem" />
        <img src={dragDog} alt="drag dog" style={{ width: "50%" }} />
        <Empty height="5rem" />
        <Typography variant="body1">완성된 사업계획서를 Drag dog에 넣으면?</Typography>
        <Empty height="2rem" />
        <img
          src={mainAsset1}
          alt="main-asset1"
          style={{
            maxWidth: "100%",
          }}
        />
        <Empty height="5rem" />

        <Typography variant="body1">우와! 사업계획서가 키워드 별로 자동 정리가 되었다!</Typography>
        <Typography variant="body1">텍스트에 이미지까지?</Typography>
        <Empty height="2rem" />
        <img
          src={mainAsset2}
          alt="main-asset1"
          style={{
            maxWidth: "100%",
          }}
        />
        <Empty height="5rem" />
      </PageLayout.Body>
      <PageLayout.MainCta>
        <MainCtaBtn onClick={() => navigate("/upload")}>Start!</MainCtaBtn>
      </PageLayout.MainCta>
    </PageLayout>
  );
};
