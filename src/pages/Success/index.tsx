import React from "react";
import { Typography } from "@mui/material";
import { PageLayout } from "../../components/layouts/PageLayout";
import { useAtomValue } from "jotai";
import { questionAtom, resProposalsAtom } from "../../store/atoms";
import { Empty } from "../../components/atoms";
import { appColor } from "../../constants/appColor";

export const Success = () => {
  const resProposal = useAtomValue(resProposalsAtom);
  const question = useAtomValue(questionAtom);
  return (
    <PageLayout>
      <PageLayout.Title />
      <PageLayout.SubTitle>
        <Typography variant="h1">사업계획서 작성 완료!</Typography>
      </PageLayout.SubTitle>
      <PageLayout.Body>
        {/* [Todo] 사업계획서처럼 꾸며주기 */}
        <div style={{ border: `1px solid ${appColor.grey2}`, padding: "4rem 2rem" }}>
          <Typography variant="h4">1. {question}</Typography>
          <Empty height="1rem" />
          {resProposal.map(({ additional, answer }, index) => (
            <>
              <Typography key={index} variant="h5">
                ■ {answer}
              </Typography>
              <Empty height="1rem" />
              {additional.map((str, idx) => (
                <>
                  <Typography key={idx}>- {str}</Typography>
                  <Empty height="0.5rem" />
                </>
              ))}
              <Empty height="2rem" />
            </>
          ))}
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
};
