import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useIsSignIn } from "../../hooks/useIsSignIn";
import { ResPostGenerateProposalSummary, proposalApi } from "../../apis/proposal";
import { useAtomValue, useSetAtom } from "jotai";
import { accessTokenAtom, questionAtom, resProposalsAtom } from "../../store/atoms";
import { useAlert } from "../../hooks/useAlert";
import { useModal } from "../../hooks/useModal";
import Typography from "@mui/material/Typography/Typography";
import { Empty } from "../../components/atoms";
import TextField from "@mui/material/TextField/TextField";
import { AccordionList, Content } from "../../components/organisms/AccordionList";
import { InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { isEmpty } from "../../lib/utils/isEmpty";
import { LOGIN_STATE } from "../../constants/enum";
import { List, ListItem, Checkbox, Button } from "@mui/material";
import BusinessItemBox from "./EmptyProposalBox";

// [Todo] 리펙터링 필요
export const useUpload = () => {
  const accessToken = useAtomValue(accessTokenAtom);
  const navigate = useNavigate();
  // [Todo] Alert 수정 필요
  const { openAlert, Alert } = useAlert();
  const successAlert = useAlert();
  const [posts, setPosts] = React.useState<{ id: number; name: string }[]>([]);
  const { loginState } = useIsSignIn();
  const [summary, setSummary] = React.useState<{ [key: string]: string[] }>({});
  const [openedSummaryId, setOpenedSummaryId] = React.useState<string>("");
  const setResProposal = useSetAtom(resProposalsAtom);
  const [contents, setContents] = React.useState<Content>({});
  const summaryModal = useModal();
  const contentsSearchModal = useModal();
  const setSelectedSummary = useSetAtom(questionAtom);

  // [Todo] mutaion이 아닌 query로 변경 필요
  const mutGetFileInfoList = useMutation({
    mutationFn: async () => {
      return await proposalApi.getProposalInfoList({ accessToken });
    },
    onSuccess: (res) => {
      setPosts(res.data);
      setIsSelectedProposalList(Array(res.data.length).fill(true));
    },
    onError: () => openAlert(),
  });

  const mutSummaizePdf = useMutation({
    mutationFn: async (file: File) => {
      return await proposalApi.postSummarizePdf({ accessToken, file });
    },
    onSuccess: () => {
      summaryModal.handleOpen();
      mutGetFileInfoList.mutate();
    },
    onError: () => openAlert(),
  });

  const mutDeleteProposalSummary = useMutation({
    mutationFn: async (proposalKey: number) => {
      await proposalApi.deleteProposalSummary({ accessToken, proposalKey });
    },
    onSuccess: () => mutGetFileInfoList.mutate(),
    onError: () => openAlert(),
  });

  const mutGetPropsalSummary = useMutation({
    mutationFn: async (proposalKey: number) => {
      setOpenedSummaryId(String(proposalKey));
      return await proposalApi.getPropsalSummary({ accessToken, proposalKey });
    },
    onSuccess: (res) => {
      setSummary(res.data);
      summaryModal.handleOpen();
    },
  });

  const mutSearchContents = useMutation({
    mutationFn: async (query: string) => {
      return await proposalApi.getSearchContents({ accessToken, query });
    },
    onSuccess: (res) => {
      setContents(res.data);
      contentsSearchModal.handleOpen();
    },
    onError: () => openAlert(),
  });

  const mutPutProposals = useMutation({
    mutationFn: async ({ summaryId, summaries }: { summaryId: string; summaries: object }) => {
      return await proposalApi.putProposalSummary({
        accessToken,
        summaryId,
        summaries,
      });
    },
    onSuccess: () => {
      mutGetPropsalSummary.mutate(Number(openedSummaryId));
      successAlert.openAlert();
    },
    onError: () => openAlert(),
  });

  const [proposalSummary, setProposalSummary] = React.useState<ResPostGenerateProposalSummary>({});
  const selectBoxModal = useModal();
  const propsGenerateProposalSummary = React.useRef<{
    referenceFileIds: string[];
    answerType: string;
  }>({ referenceFileIds: [""], answerType: "" });
  const mutPostGenerateProposalSummary = useMutation({
    mutationFn: async ({
      pdf,
      referenceFileIds,
      answerType,
    }: {
      pdf: File;
      referenceFileIds: string[];
      answerType: string;
    }) => {
      const proposalSummary = await proposalApi.postGenerateProposalSummary({ accessToken, pdf });
      setProposalSummary(proposalSummary);
      propsGenerateProposalSummary.current = { referenceFileIds, answerType };
    },
    onSuccess: () => selectBoxModal.handleOpen(),
  });

  const mutPostAnswerProposal = useMutation({
    mutationFn: async () => {
      await Promise.all(
        Object.entries(proposalSummary).map(async ([key, props]) => {
          const value = await proposalApi.postAnswerProposal({
            accessToken,
            referenceFileIds: propsGenerateProposalSummary.current.referenceFileIds,
            answerType: propsGenerateProposalSummary.current.answerType,
            ...props,
          });
          setResProposal((prev) => [...prev, value]);
        })
      );
    },
    onSuccess: () => navigate("/success"),
  });

  const [isSelectedProposalList, setIsSelectedProposalList] = React.useState<boolean[]>([]);

  const onCheck = ({ index, checked }: { index: number; checked: boolean }) => {
    setIsSelectedProposalList((prev) => {
      const temp = [...prev];
      temp[index] = checked;
      return temp;
    });
  };

  const SummaryModal = () => {
    const [_summary, _setSummary] = React.useState<{ [key: string]: string[] }>(summary);
    return (
      <summaryModal.Modal>
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
        {!isEmpty(_summary) ? (
          <AccordionList
            contentList={_summary}
            setContents={_setSummary}
            update={mutPutProposals.mutate}
            summaryId={openedSummaryId}
          />
        ) : (
          <div style={{ width: "100%", textAlign: "center" }}>
            <Typography>검색 결과가 없습니다.</Typography>
          </div>
        )}
        <Empty height="1rem" />
      </summaryModal.Modal>
    );
  };

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

  const onDelete = (proposalId: number) => {
    mutDeleteProposalSummary.mutate(proposalId);
  };

  const SuccessAlert = () => (
    <successAlert.Alert severity="success">
      <Typography>요약된 사업계획서가 수정되었습니다.</Typography>
    </successAlert.Alert>
  );

  const SelectBoxModal = () => {
    const [selected, setSelected] = React.useState<boolean[]>(
      Object.entries(proposalSummary).map((x) => true)
    );
    return (
      <selectBoxModal.Modal>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">항목을 선택해주세요.</Typography>
          <Empty height="1rem" />
          <Typography variant="caption">(선택하신 항목으로 사업계획서를 작성합니다.)</Typography>
        </div>
        <Empty height="1rem" />
        <List sx={{ width: "100%" }}>
          {Object.entries(proposalSummary).map(([key, props], idx) => (
            <ListItem
              key={key}
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                textDecoration: !selected[idx] ? "line-through" : "",
                color: !selected[idx] ? "gray" : "",
              }}
            >
              <Typography
                sx={{
                  maxWidth: "70%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textAlign: "baseline",
                }}
              >
                <BusinessItemBox initialData={props} />

                {/*{`${idx + 1}. ${props.question}`}*/}
              </Typography>
              <Checkbox
                checked={selected[idx]}
                onChange={(e) =>
                  setSelected((prev) => {
                    const temp = [...prev];
                    temp[idx] = e.target.checked;
                    return temp;
                  })
                }
              />
            </ListItem>
          ))}
        </List>
        <Empty height="1rem" />
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            component="label"
            sx={{
              width: "30%",
              height: "4rem",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => {
              const selectedSummary = Object.entries(proposalSummary).filter(
                (_, idx) => selected[idx]
              );
              setProposalSummary(Object.fromEntries(selectedSummary));
              setSelectedSummary(selectedSummary.map((x) => x[1].question!));
              mutPostAnswerProposal.mutate();
              selectBoxModal.handleClose();
            }}
          >
            <Typography>AI 사업 계획서 만들기</Typography>
          </Button>
        </div>
      </selectBoxModal.Modal>
    );
  };

  React.useLayoutEffect(() => {
    // [Error] 토큰이 있는데 로그인 페이지로 이동하는 문제
    if (loginState === LOGIN_STATE.NOT_LOGGED_IN) {
      navigate("/sign-in");
    } else if (loginState === LOGIN_STATE.LOGGED_IN) {
      mutGetFileInfoList.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState]);

  // [Todo] 리팩터링 필요
  return {
    posts,
    isSelectedProposalList,
    onCheck,
    postSummarizePdf: mutSummaizePdf.mutate,
    getPropsalSummary: mutGetPropsalSummary.mutate,
    generateNewProposal: mutPostGenerateProposalSummary.mutate,
    generateProposalSummaryLoading:
      mutPostGenerateProposalSummary.isLoading || mutPostAnswerProposal.isLoading,
    onDelete,
    isSummaryLoading: mutSummaizePdf.isLoading,
    Alert,
    SuccessAlert,
    SummaryModal,
    openContentsSearchModal: contentsSearchModal.handleOpen,
    ContentsSearchModal,
    SelectBoxModal,
  };
};
