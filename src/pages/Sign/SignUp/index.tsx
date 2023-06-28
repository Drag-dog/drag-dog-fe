import React from "react";
import { PageLayout } from "../../../components/layouts/PageLayout";
import { Typography } from "@mui/material";
import { useSignUp } from "./hook";
import { Form } from "../../../components/atoms";
import { PwField, InputMulti, MainCtaBtn } from "../../../components/molecules";
import { Empty } from "../../../components/atoms";
import { IdField } from "../SignIn/components";

export const SignUp = () => {
  const { reg, errors, onSubmit } = useSignUp();
  return (
    <>
      <PageLayout>
        <PageLayout.Title />
        <PageLayout.SubTitle>
          <Typography>회원 정보를 입력해주세요.</Typography>
        </PageLayout.SubTitle>
        <PageLayout.Body>
          <Form onSubmit={onSubmit}>
            <div style={{ width: "100%" }}>
              <Typography variant="h5">Email</Typography>
            </div>
            <Empty height="1rem" />
            <IdField useControllerProps={reg.email} setValue={() => {}} />
            <Empty height="2rem" />
            <div style={{ width: "100%" }}>
              <Typography variant="h5">Password</Typography>
            </div>
            <Empty height="1rem" />
            <InputMulti
              names={[reg.password.name, reg.confirmPassword.name]}
              errors={errors}
              style={{ display: "flex" }}
            >
              <PwField disableHelperText label="PASSWORD" useControllerProps={reg.password} />
              &nbsp;
              <PwField disableHelperText label="CONFIRM" useControllerProps={reg.confirmPassword} />
            </InputMulti>
            <Empty height="2rem" />
            <MainCtaBtn type="submit">회원가입</MainCtaBtn>
          </Form>
        </PageLayout.Body>
      </PageLayout>
    </>
  );
};
