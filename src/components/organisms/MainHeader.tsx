import React from "react";
import { Toolbar, Stack, Button, Typography } from "@mui/material";
import { Title } from "../molecules/Title";
import PortraitIcon from "@mui/icons-material/Portrait";
import { useSign } from "../../hooks/useSign";
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "../../store/atoms";
import { LOGIN_STATE } from "../../constants/enum";
import { useModal } from "../../hooks/useModal";
import { useMutation } from "react-query";
import { proposalApi } from "../../apis/proposal";
import { useAlert } from "../../hooks/useAlert";
import {
  ProposalSummaryProxy,
  ProposalSummaryList,
} from "../../pages/Upload/proxys/ProposalSummary.proxy";
import { ContentsSearchModal } from "./ContentSearchModal";

export const MainHeader = () => {
  const { openAlert, Alert } = useAlert();
  const { loginState, setLoginStateSignOut } = useSign();
  const accessToken = useAtomValue(accessTokenAtom);
  const navigate = useNavigate();
  const [contents, setContents] = React.useState<ProposalSummaryList>([]);

  const mutSearchContents = useMutation({
    mutationFn: async (query: string) => {
      return await proposalApi.getSearchContents({ accessToken, query });
    },
    onSuccess: (res) => {
      setContents(ProposalSummaryProxy.toFE(res.data));
      contentsSearchModal.handleOpen();
    },
    onError: (e: any) => openAlert({ contents: e.message, severity: "error" }),
  });

  const contentsSearchModal = useModal();

  const LoginButton = () => {
    return (
      <Button onClick={() => navigate("/sign-in")}>
        <PortraitIcon sx={{ color: "GrayText" }} />
        <Typography color="GrayText" fontSize="12px">
          로그인
        </Typography>
      </Button>
    );
  };

  const LogoutButton = () => {
    return (
      <Button
        onClick={() => {
          setLoginStateSignOut();
          navigate("/");
        }}
      >
        <PortraitIcon sx={{ color: "GrayText" }} />
        &nbsp;
        <Typography color="GrayText" fontSize="12px">
          로그아웃
        </Typography>
      </Button>
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
        <ContentsSearchModal
          Modal={contentsSearchModal.Modal}
          searchContents={mutSearchContents.mutate}
          contents={contents}
        />
        <Alert />
      </div>
      <Title />

      <Stack direction="row" spacing={2} sx={{ marginLeft: 2, flexGrow: 1, justifyContent: "end" }}>
        <Button
          onClick={() => {
            if (loginState !== LOGIN_STATE.LOGGED_IN) return navigate("/sign-in");
            contentsSearchModal.handleOpen();
            proposalApi.getSearchContents({ accessToken, query: "" }).then((res) => {
              setContents(ProposalSummaryProxy.toFE(res.data));
            });
          }}
          size="small"
        >
          <Typography color="GrayText" fontSize="12px">
            기존 항목 검색
          </Typography>
        </Button>
        <Button
          onClick={() =>
            loginState === LOGIN_STATE.LOGGED_IN ? navigate("/upload") : navigate("/sign-in")
          }
        >
          <Typography color="GrayText" fontSize="12px">
            업로드
          </Typography>
        </Button>
        <Button
          onClick={() =>
            loginState === LOGIN_STATE.LOGGED_IN ? navigate("/success") : navigate("/sign-in")
          }
        >
          <Typography color="GrayText" fontSize="12px">
            최근 사업계획서
          </Typography>
        </Button>

        {loginState === LOGIN_STATE.LOGGED_IN ? <LogoutButton /> : <LoginButton />}
      </Stack>
    </Toolbar>
  );
};
