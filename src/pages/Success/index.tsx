import React from "react";
import { Typography } from "@mui/material";
import { PageLayout } from "../../components/layouts/PageLayout";
import { useAtomValue } from "jotai";
import { resProposalsAtom } from "../../store/atoms";
import { Empty } from "../../components/atoms";

export const Success = () => {
  const resProposal = useAtomValue(resProposalsAtom);
  return (
    <PageLayout>
      <PageLayout.Title />
      <PageLayout.SubTitle>
        <Typography variant="h1">사업계획서 작성 완료!</Typography>
      </PageLayout.SubTitle>
      <PageLayout.Body>
        {resProposal.split("\n").map((line, index) => (
          <>
            <Typography key={index} variant="body1">
              {line}
            </Typography>
            <Empty height="1rem" />
          </>
        ))}
      </PageLayout.Body>
    </PageLayout>
  );
};
