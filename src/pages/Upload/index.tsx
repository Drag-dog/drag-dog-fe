import React from "react";
import { PageLayout } from "../../components/layouts/PageLayout";
import { Typography, Button } from "@mui/material";
import { Empty } from "../../components/atoms";
import { appColor } from "../../constants/appColor";
import { useUpload } from "./hook";
import { Loading } from "../../components/molecules";
import { ProposalList } from "./ProposalList";
import loadingDog from "../../assets/loading.png";
import { sizes } from "../../constants/sizes";
import { useModal } from "../../hooks/useModal";

export const Upload = () => {
  const {
    posts,
    isSelectedProposalList,
    onCheck,
    postSummarizePdf,
    generateProposal,
    isSummaryLoading,
    isGenerateLoading,
    isSummarySuccess,
    Alert,
    summary,
  } = useUpload();
  const { handleOpen, Modal } = useModal();

  React.useEffect(() => {
    if (isSummarySuccess) handleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageLayout>
      <PageLayout.Title />
      <PageLayout.SubTitle>
        <Typography variant="h1">Upload</Typography>
      </PageLayout.SubTitle>
      <PageLayout.Absolute>
        {isSummaryLoading && <Loading />}
        <Alert>오류가 발생했습니다.</Alert>
        <Modal>
          <Typography variant="h4">요약 결과</Typography>
          <Empty height="1rem" />
          {Object.entries(summary).map(([key, value]) => (
            <>
              <Typography key={key}>{key}</Typography>
              <Typography key={key}>{value as string}</Typography>
              <Empty height="1rem" />
            </>
          ))}
        </Modal>
      </PageLayout.Absolute>
      <PageLayout.Body>
        {isGenerateLoading ? (
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
        ) : (
          <>
            <Typography>학습시킬 사업 계획서를 선택해주세요!</Typography>
            <Empty height="2rem" />
            {posts.length === 0 ? (
              <div style={{ width: "100%" }}>
                <Typography variant="body1">게시글이 없습니다.</Typography>
              </div>
            ) : (
              <>
                <ProposalList
                  posts={posts}
                  onCheck={onCheck}
                  isSelectedProposalList={isSelectedProposalList}
                />
                <Empty height="5rem" />
              </>
            )}
            <div
              style={{
                maxWidth: `${sizes.pageMaxWidth}px`,
                width: "100%",
                position: "fixed",
                bottom: "2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                component="label"
                sx={{
                  width: "25%",
                  height: "4rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography>새로운 사업 계획서 추가</Typography>
                <input
                  style={{ display: "none" }}
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    if (!e.target.files?.[0]) return;
                    postSummarizePdf(e.target.files[0]);
                  }}
                />
              </Button>
              <Button
                variant="contained"
                component="label"
                sx={{
                  width: "50%",
                  height: "4rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography>사업 계획서 작성하기</Typography>
                <Typography variant="caption" color={appColor.lightBlue1}>
                  빈 양식을 넣어주세요!
                </Typography>

                <input
                  style={{ display: "none" }}
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    if (!e.target.files?.[0]) return;
                    const referenceFileIds = posts
                      .map((post, i) => (isSelectedProposalList[i] ? post.id : null))
                      .filter((id) => id !== null) as number[];

                    generateProposal({
                      referenceFileIds,
                      pdf: e.target.files[0],
                    });
                  }}
                />
              </Button>
            </div>
          </>
        )}
      </PageLayout.Body>
    </PageLayout>
  );
};
