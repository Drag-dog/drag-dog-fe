import React from "react";
import { PageLayout } from "../../components/layouts/PageLayout";
import { Typography, Button } from "@mui/material";
import { Empty } from "../../components/atoms";
import { useUpload } from "./hook";
import { Loading } from "../../components/molecules";
import { ProposalList } from "./ProposalList";
import { sizes } from "../../constants/sizes";
import { LoadingComponent } from "./Loading";

export const Upload = () => {
  const {
    posts,
    isSelectedProposalList,
    onCheck,
    postSummarizePdf,
    onDelete,
    isSummaryLoading,
    isGenerateLoading,
    getPropsalSummary,
    Alert,
    SummaryModal,
    openUploadModal,
    UploadModal,
  } = useUpload();

  // [Todo] 4103 invalid token 에러 처리
  // [Todo] 스르륵 올라오는 애니메이션 추가
  return (
    <PageLayout>
      <PageLayout.Title />
      <PageLayout.SubTitle>
        <Typography variant="h1">Upload</Typography>
      </PageLayout.SubTitle>
      <PageLayout.Absolute>
        {isSummaryLoading && <Loading />}
        <Alert>오류가 발생했습니다.</Alert>
        <SummaryModal />
        <UploadModal />
      </PageLayout.Absolute>
      <PageLayout.Body>
        {isGenerateLoading ? (
          <LoadingComponent />
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
                  onDelete={onDelete}
                  onClick={getPropsalSummary}
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
                  width: "30%",
                  height: "4rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography>학습시킬 사업 계획서 추가</Typography>
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
                onClick={() => openUploadModal()}
              >
                <Typography>사업 계획서 작성하기</Typography>
              </Button>
            </div>
          </>
        )}
      </PageLayout.Body>
    </PageLayout>
  );
};
