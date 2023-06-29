import React from "react";
import { PageLayout } from "../../components/layouts/PageLayout";
import { Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { Empty } from "../../components/atoms";
import { useIsSignIn } from "../../hooks/useIsSignIn";
import { useNavigate } from "react-router-dom";

export const Upload = () => {
  const { isSignIn } = useIsSignIn();
  const navigate = useNavigate();
  const posts = [
    {
      id: 1,
      title: "사업계획서1",
      content: "사업계획서1 내용",
    },
    {
      id: 2,
      title: "사업계획서2",
      content: "사업계획서2 내용",
    },
    {
      id: 3,
      title: "사업계획서3",
      content: "사업계획서3 내용",
    },
    {
      id: 3,
      title: "사업계획서3",
      content: "사업계획서3 내용",
    },
    {
      id: 3,
      title: "사업계획서3",
      content: "사업계획서3 내용",
    },
    {
      id: 3,
      title: "사업계획서3",
      content: "사업계획서3 내용",
    },
    {
      id: 3,
      title: "사업계획서3",
      content: "사업계획서3 내용",
    },
  ];

  // [Todo] 선택된 제안서 상태관리
  // const [selectedProposal, serSelectedProposal] = React.useState(false);

  React.useLayoutEffect(() => {
    if (!isSignIn) {
      navigate("/sign-in");
    }
  }, [isSignIn, navigate]);

  return (
    <PageLayout>
      <PageLayout.Title />
      <PageLayout.SubTitle>
        <Typography variant="h1">Upload</Typography>
      </PageLayout.SubTitle>
      <PageLayout.Body>
        <Typography>완성된 사업계획서를 업로드해보세요!</Typography>
        <Empty height="2rem" />
        {posts.length === 0 ? (
          <Typography variant="body1">게시글이 없습니다.</Typography>
        ) : (
          <List sx={{ width: "100%" }}>
            {posts.map((post) => (
              <>
                <Button sx={{ border: "1px solid black", width: "100%" }}>
                  <ListItem key={post.id}>
                    <ListItemText primary={post.title} secondary={post.content} />
                  </ListItem>
                </Button>
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
            <input id={"file-input"} style={{ display: "none" }} type="file" name="imageFile" />
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
          </Button>
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
};
