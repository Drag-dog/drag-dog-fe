import React from "react";
import { PageLayout } from "../../components/layouts/PageLayout";
import { Typography, Button, List, ListItem, ListItemText, Checkbox } from "@mui/material";
import { Empty } from "../../components/atoms";
import { appColor } from "../../constants/appColor";
import { useUpload } from "./hook";

export const Upload = () => {
  const {
    posts,
    isSelectedProposalList,
    onCheck,
    postSummarizePdf,
    generateProposal,
    isLoading,
    Alert,
  } = useUpload();

  return (
    <PageLayout>
      <PageLayout.Title />
      <PageLayout.SubTitle>
        <Typography variant="h1">Upload</Typography>
      </PageLayout.SubTitle>
      <PageLayout.Absolute>{isLoading && <Alert>오류가 발생했습니다.</Alert>}</PageLayout.Absolute>
      <PageLayout.Body>
        <Typography>완성된 사업계획서를 업로드해보세요!</Typography>
        <Empty height="2rem" />
        {posts.length === 0 ? (
          <Typography variant="body1">게시글이 없습니다.</Typography>
        ) : (
          <List sx={{ width: "100%" }}>
            {posts.map((post, i) => (
              <>
                {/* 카드 형태로 ㄱㄱ */}
                <ListItem
                  key={post.id}
                  sx={{
                    borderBottom: `1px solid ${appColor.lightBlue1}`,
                    width: "100%",
                    backgroundColor: `${isSelectedProposalList[i] ? appColor.lightBlue1 : ""}`,
                  }}
                >
                  <ListItemText primary={post.name} />
                  <Checkbox
                    value={isSelectedProposalList[i]}
                    onChange={(e) => {
                      onCheck({ index: i, checked: e.target.checked });
                    }}
                    checked={isSelectedProposalList[i]}
                  />
                </ListItem>
                <Empty height="1rem" />
              </>
            ))}
          </List>
        )}
        <div
          style={{
            width: "100%",
            position: "sticky",
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
      </PageLayout.Body>
    </PageLayout>
  );
};
