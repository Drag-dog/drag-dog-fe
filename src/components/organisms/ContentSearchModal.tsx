import { IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import React from "react";
import { Empty } from "../atoms";
import { MutateOptions } from "react-query";
import SearchIcon from "@mui/icons-material/Search";
import { isEmpty } from "../../lib/utils/isEmpty";
import { AccordionList } from "./AccordionList";
import { ProposalSummaryList } from "../../pages/Upload/proxys/ProposalSummary.proxy";

export const ContentsSearchModal = ({
  Modal,
  searchContents,
  contents,
}: PropsContentsSearchModal) => {
  const [query, setQuery] = React.useState<string>("");
  return (
    <Modal>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h5">기존 항목 검색</Typography>
        </div>
        <Empty height="1rem" />
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <Typography>사업 계획서의 문항을 입력해주세요.</Typography>
          <Typography variant="caption">
            (학습된 기존 사업 계획서를 새로 생성없이 빠르게 확인 가능합니다.)
          </Typography>
        </div>
        <TextField
          placeholder="ex) 사업 개요"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchContents(query);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={(e) => {
                    searchContents(query);
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Empty height="2rem" />
        {!isEmpty(contents) ? (
          <AccordionList contentList={contents} />
        ) : (
          <div style={{ width: "100%", textAlign: "center" }}>
            <Typography>검색 결과가 없습니다.</Typography>
          </div>
        )}
      </div>
    </Modal>
  );
};

type PropsContentsSearchModal = {
  Modal: ({ children }: { children: React.ReactNode }) => JSX.Element;
  searchContents: (
    variables: string,
    options?: MutateOptions<any, unknown, string, unknown> | undefined
  ) => void;
  contents: ProposalSummaryList;
};
