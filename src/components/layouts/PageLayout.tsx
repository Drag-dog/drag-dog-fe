import React from "react";
import styled from "@emotion/styled";
import { getChildrenByName } from "../../lib/utils/getChildrenByName";
import { isEmpty } from "../../lib/utils/isEmpty";
import { Empty } from "../atoms";
import { sizes } from "../../constants/sizes";
import { MainHeader } from "../organisms/MainHeader";
import { useSetLoginState } from "../../hooks/useSetLoginState";

const Layout = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: sizes.pageMaxWidth,
  margin: "auto",
});

type Props = { children?: React.ReactNode };

const Main = ({ children }: Props) => {
  const [TitleComponenets] = getChildrenByName(children, "Title");
  const [SubTitleComponenets] = getChildrenByName(children, "SubTitle");
  const arrayBodyComponenets = getChildrenByName(children, "Body");
  const arrayAbsoluteComponenets = getChildrenByName(children, "Absolute");
  const arrayMainCtaComponenets = getChildrenByName(children, "MainCta");

  /**
   * @description 로그인 상태를 설정
   */
  useSetLoginState();

  return (
    <Layout>
      {isEmpty(arrayAbsoluteComponenets) || arrayAbsoluteComponenets}
      {!!TitleComponenets ? (
        <>
          <Empty height="1rem" />
          {TitleComponenets}
          <Empty height="1.5rem" />
        </>
      ) : (
        <Empty height="1rem" />
      )}
      {!!SubTitleComponenets ? SubTitleComponenets : <Empty height="0.5rem" />}
      <Empty height="2rem" />
      {isEmpty(arrayBodyComponenets) || arrayBodyComponenets}
      <Empty height="2rem" />
      {isEmpty(arrayMainCtaComponenets) || arrayMainCtaComponenets}
    </Layout>
  );
};

const Title = () => {
  return <MainHeader />;
};

const SubTitle = ({ children }: Props) => {
  return <>{children}</>;
};

const Absolute = ({ children }: Props) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
      }}
    >
      {children}
    </div>
  );
};

const Body = ({ children }: Props) => {
  return <>{children}</>;
};

const MainCta = ({ children }: Props) => {
  return (
    <div
      style={{
        position: "sticky",
        bottom: 50,
        zIndex: 1,
      }}
    >
      {children}
    </div>
  );
};

export const PageLayout = Object.assign(Main, { Title, SubTitle, Absolute, Body, MainCta });
