import React from "react";
import { PageLayout } from "../../components/layouts/PageLayout";
import { Typography, Button } from "@mui/material";
import { Empty } from "../../components/atoms";
import { useUpload } from "./hook";
import { useLoading } from "../../hooks/useLoading";
import { ProposalList } from "./ProposalList";
import { sizes } from "../../constants/sizes";
import { LoadingComponent } from "./Loading";

export const Upload = () => {
  const {
    proposalInfoList,
    isSelectedProposalList,
    onCheck,
    postSummarizePdf,
    onDelete,
    isSummaryLoading,
    getPropsalSummary,
    Alert,
    SummaryModal,
    generateNewProposal,
    generateProposalSummaryLoading,
    SuccessAlert,
    SelectBoxModal,
    UploadModal,
    openUploadModal,
  } = useUpload();
  const { Loading } = useLoading();

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
        <UploadModal />
        <SummaryModal />
        <SuccessAlert />
        <SelectBoxModal />
      </PageLayout.Absolute>
      <PageLayout.Body>
        {generateProposalSummaryLoading ? (
          <LoadingComponent />
        ) : (
          <>
            <Typography>학습시킬 사업 계획서를 선택해주세요!</Typography>
            <Typography variant="caption">
              (업로드한 사업 계획서를 클릭하시면 요약된 정보를 확인 가능합니다)
            </Typography>
            <Empty height="2rem" />
            {proposalInfoList.length === 0 ? (
              <div style={{ width: "100%" }}>
                <Typography variant="body1">게시글이 없습니다.</Typography>
              </div>
            ) : (
              <>
                <ProposalList
                  posts={proposalInfoList}
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
                    e.target.files = null;
                    e.target.value = "";
                  }}
                />
              </Button>
              <div
                style={{
                  display: "flex",
                  width: "50%",
                }}
              >
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    width: "50%",
                    height: "4rem",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={openUploadModal}
                >
                  <Typography>단일 항목 작성하기</Typography>
                </Button>
                <Empty width="1rem" />
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
                  <Typography>⭐ AI 사업 계획서 작성하기</Typography>
                  <Typography variant="caption">
                    (새 양식에 맞게 사업 계획서를 작성합니다.)
                  </Typography>
                  <input
                    style={{ display: "none" }}
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      if (!e.target.files?.[0]) return;
                      const referenceFileIds = proposalInfoList
                        .map((post, i) => (isSelectedProposalList[i] ? String(post.id) : null))
                        .filter((id) => id !== null) as string[];

                      generateNewProposal({
                        pdf: e.target.files[0],
                        referenceFileIds,
                      });
                    }}
                  />
                </Button>
              </div>
            </div>
          </>
        )}
      </PageLayout.Body>
    </PageLayout>
  );
};
