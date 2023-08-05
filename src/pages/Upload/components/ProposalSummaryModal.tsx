import React from "react";
import { Typography } from "@mui/material";
import { Empty } from "../../../components/atoms";
import { AccordionList } from "../../../components/organisms/AccordionList";
import { isEmpty } from "../../../lib/utils/isEmpty";
import { UseMutateFunction } from "react-query";
import { ProposalSummaryObj } from "../../../apis/proposal";
import { ProposalSummaryList } from "../proxys/ProposalSummary.proxy";

export const ProposalSummaryModal = ({
  proposalSummaryList,
  Modal,
  update,
  openedSummaryId,
}: PropsProposalSummaryModal) => {
  const [_proposalSummary, _setProposalSummary] =
    React.useState<ProposalSummaryList>(proposalSummaryList);
  return (
    <Modal>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">요약된 사업계획서</Typography>
        <Empty height="0.5rem" />
        <Typography variant="caption">(사업계획서의 내용도 수정가능합니다. )</Typography>
      </div>
      <Empty height="1rem" />
      {!isEmpty(_proposalSummary) ? (
        <AccordionList
          contentList={_proposalSummary}
          setProposalSummaryList={_setProposalSummary}
          update={update}
          summaryId={openedSummaryId}
        />
      ) : (
        <div style={{ width: "100%", textAlign: "center" }}>
          <Typography>검색 결과가 없습니다.</Typography>
        </div>
      )}
      <Empty height="1rem" />
    </Modal>
  );
};

type PropsProposalSummaryModal = {
  proposalSummaryList: ProposalSummaryList;
  Modal: ({ children }: { children: React.ReactNode }) => JSX.Element;
  update: UseMutateFunction<
    any,
    unknown,
    {
      summaryId: string;
      summaries: ProposalSummaryObj;
    },
    unknown
  >;
  openedSummaryId: string;
};
