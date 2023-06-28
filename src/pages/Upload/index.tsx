import React from "react";
import { PageLayout } from "../../components/layouts/PageLayout";
import { Typography, Button } from "@mui/material";
import { Empty } from "../../components/atoms";

export const Upload = () => {
  return (
    <PageLayout>
      <PageLayout.Title />
      <PageLayout.Body>
        <Typography>완성된 사업계획서를 업로드해보세요!</Typography>
        <Empty height="2rem" />
        <Button variant="contained" component="label">
          <Typography>사업계획서 업로드</Typography>

          <input id={"file-input"} style={{ display: "none" }} type="file" name="imageFile" />
        </Button>
      </PageLayout.Body>
    </PageLayout>
  );
};
