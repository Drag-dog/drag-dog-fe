import React from "react";
import { Toolbar, Stack, Button, Typography } from "@mui/material";
import { Title } from "../molecules/Title";
import PortraitIcon from "@mui/icons-material/Portrait";
import { useIsSignIn } from "../../hooks/useIsSignIn";
import { useNavigate } from "react-router-dom";
import { useAtomValue, useSetAtom } from "jotai";
import { accessTokenAtom } from "../../store/atoms";
import { LOGIN_STATE } from "../../constants/enum";
import { useModal } from "../../hooks/useModal";
import TextField from "@mui/material/TextField/TextField";
import { InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Empty } from "../../components/atoms";
import { useMutation } from "react-query";
import { proposalApi } from "../../apis/proposal";
import { AccordionList } from "./AccordionList";
import { useAlert } from "../../hooks/useAlert";
import { isEmpty } from "../../lib/utils/isEmpty";
import {
  ProposalSummaryProxy,
  ProposalSummaryList,
} from "../../pages/Upload/proxys/ProposalSummary.proxy";

export const MainHeader = () => {
  const { openAlert, Alert } = useAlert();
  const { loginState } = useIsSignIn();
  const accessToken = useAtomValue(accessTokenAtom);
  const navigate = useNavigate();
  const [contents, setContents] = React.useState<ProposalSummaryList>([]);
  const setAccessToken = useSetAtom(accessTokenAtom);

  const mutSearchContents = useMutation({
    mutationFn: async (query: string) => {
      return await proposalApi.getSearchContents({ accessToken, query });
    },
    onSuccess: (res) => {
      setContents(ProposalSummaryProxy.toFE(res.data));
      contentsSearchModal.handleOpen();
    },
    onError: () => openAlert(),
  });

  const contentsSearchModal = useModal();

  const ContentsSearchModal = () => {
    const [query, setQuery] = React.useState<string>("");
    return (
      <contentsSearchModal.Modal>
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
              if (e.key === "Enter") mutSearchContents.mutate(query);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={(e) => {
                      mutSearchContents.mutate(query);
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
      </contentsSearchModal.Modal>
    );
  };

  return (
    <Toolbar
      variant="dense"
      sx={{
        position: "sticky",
        display: "flex",
        justifyContent: "space-between",
        top: -1,
        backdropFilter: "blur(1px)",
        width: "100%",
        zIndex: 100,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
        }}
      >
        <ContentsSearchModal />
        <Alert>검색에 실패하였습니다</Alert>
      </div>
      <Title />

      <Stack direction="row" spacing={2} sx={{ marginLeft: 2, flexGrow: 1, justifyContent: "end" }}>
        <Button onClick={() => contentsSearchModal.handleOpen()} size="small">
          <Typography color="GrayText" fontSize="12px">
            기존 항목 검색
          </Typography>
        </Button>
        <Button onClick={() => navigate("/upload")}>
          <Typography color="GrayText" fontSize="12px">
            업로드
          </Typography>
        </Button>
        <Button onClick={() => navigate("/success")}>
          <Typography color="GrayText" fontSize="12px">
            최근 사업계획서
          </Typography>
        </Button>

        {loginState === LOGIN_STATE.LOGGED_IN ? (
          <Button
            onClick={() => {
              setAccessToken("");
              navigate("/");
            }}
          >
            <PortraitIcon sx={{ color: "GrayText" }} />
            &nbsp;
            <Typography color="GrayText" fontSize="12px">
              로그아웃
            </Typography>
          </Button>
        ) : (
          <Button onClick={() => navigate("/sign-in")}>
            <PortraitIcon sx={{ color: "GrayText" }} />
            <Typography color="GrayText" fontSize="12px">
              로그인
            </Typography>
          </Button>
        )}
      </Stack>
    </Toolbar>
  );
};
