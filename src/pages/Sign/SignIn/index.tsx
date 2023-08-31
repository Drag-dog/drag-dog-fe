import React from "react";
import { Empty, Form } from "../../../components/atoms";
import { PageLayout } from "../../../components/layouts/PageLayout";
import { Button, Typography, Stack, Divider } from "@mui/material";
import { useSignIn } from "./hook";
import { IdField, SaveIdCheckBox } from "./components";
import { PwField, MainCtaBtn } from "../../../components/molecules";

export const SignIn = () => {
  const { reg, onSubmit, setValue, toggleSaveId, navigate, Alert } = useSignIn();

  return (
    <>
      <PageLayout>
        <PageLayout.Title />
        <PageLayout.Absolute>
          <Alert />
        </PageLayout.Absolute>
        <PageLayout.SubTitle>
          <Typography variant="h1">Sign In</Typography>
        </PageLayout.SubTitle>
        <PageLayout.Body>
          <Form onSubmit={onSubmit}>
            <IdField useControllerProps={reg.email} setValue={setValue} />
            <Empty height="3rem" />
            <PwField label="PASSWORD" useControllerProps={reg.password} />
            <SaveIdCheckBox toggleSaveId={toggleSaveId} />
            <Empty height="2rem" />
            <MainCtaBtn type="submit">로그인</MainCtaBtn>
          </Form>

          <Empty height="2rem" />

          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
            <Button
              style={{ fontSize: 15, fontFamily: "SpoqaHanSansNeo-Regular" }}
              color="inherit"
              onClick={() => navigate("/sign-up")}
            >
              회원가입
            </Button>
          </Stack>
        </PageLayout.Body>
      </PageLayout>
    </>
  );
};
