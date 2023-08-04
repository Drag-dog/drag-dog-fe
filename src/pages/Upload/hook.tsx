import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useIsSignIn } from "../../hooks/useIsSignIn";

import {
  PropsPostAnswerProposal,
  ResPostGenerateProposalSummary,
  proposalApi,
} from "../../apis/proposal";
import { useAtomValue, useSetAtom } from "jotai";
import { accessTokenAtom, questionAtom, resProposalsAtom } from "../../store/atoms";
import { useAlert } from "../../hooks/useAlert";
import { useModal } from "../../hooks/useModal";
import Typography from "@mui/material/Typography/Typography";
import { Empty } from "../../components/atoms";
import { AccordionList } from "../../components/organisms/AccordionList";
import { isEmpty } from "../../lib/utils/isEmpty";
import { LOGIN_STATE } from "../../constants/enum";
import { Button, TextField, RadioGroup, Radio, FormControlLabel } from "@mui/material";

interface ProposalInputType {
  proposalSummary: ResPostGenerateProposalSummary;
  answerType: string
}

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
  const summaryModal = useModal();
  const uploadModal = useModal(); // 단일 항목 업로드 모달
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
    onSuccess: (res) => {
      setSummary(res)
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
  }>({ referenceFileIds: [""] });
  const mutPostGenerateProposalSummary = useMutation({
    mutationFn: async ({ pdf, referenceFileIds }: { pdf: File; referenceFileIds: string[] }) => {
      const proposalSummary = await proposalApi.postGenerateProposalSummary({ accessToken, pdf });
      setProposalSummary(proposalSummary);
      propsGenerateProposalSummary.current = { referenceFileIds };
    },
    onSuccess: () => selectBoxModal.handleOpen(),
  });

  const mutPostAnswerProposal = useMutation({
      mutationFn: async (input: ProposalInputType) => {
        const { proposalSummary, answerType } = input;
        const result = await Promise.all(
          Object.entries(proposalSummary).map(async ([key, props]) => {
            try {
              return await proposalApi.postAnswerProposal({
                accessToken,
                referenceFileIds: propsGenerateProposalSummary.current.referenceFileIds,
                answerType,
                ...props,
              });
            } catch (e) {
              console.log(e)
              return '다시한번 시도해주세요'
            }
          })
        );
        setResProposal(result);

      },
      onSuccess: () => navigate("/success"),
    }
  );

  const mutGenerateProposalByOneContents = useMutation({
    mutationFn: async ({ ...props }: Omit<PropsPostAnswerProposal, "accessToken">) => {
      uploadModal.handleClose();
      return await proposalApi.postAnswerProposal({ accessToken, ...props });
    },
    onSuccess: (res) => {
      setResProposal([res]);
      navigate("/success");
    },
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

  const onDelete = (proposalId: number) => {
    mutDeleteProposalSummary.mutate(proposalId);
  };

  const SuccessAlert = () => (
    <successAlert.Alert severity="success">
      <Typography>요약된 사업계획서가 수정되었습니다.</Typography>
    </successAlert.Alert>
  );
  const SelectBoxModal = () => {
    const [answerType, setAnswerType] = React.useState<string>("descriptive");
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
        <AccordionList
          proposalSummary={proposalSummary}
          selected={selected}
          setSelected={setSelected}
          // setProposalSummary={setProposalSummary}
        />
        <Empty height="1rem" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <Typography>응답 형식</Typography>
            <Typography variant="caption">
              (서술형이면 자세히, 요약형이면 간단히 출력이 됩니다.)
            </Typography>
          </div>
          <RadioGroup row onChange={(e) => setAnswerType(e.target.value)} defaultValue={'descriptive'}>
            <FormControlLabel value="descriptive" control={<Radio size="small" />} label="서술형" />
            <FormControlLabel value="summary" control={<Radio size="small" />} label="요약형" />
          </RadioGroup>
        </div>
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
              setSelectedSummary(selectedSummary.map((x) => x[1].question!));
              mutPostAnswerProposal.mutate({
                answerType,
                proposalSummary: Object.fromEntries(selectedSummary)
              });
              selectBoxModal.handleClose();
            }}
          >
            <Typography>AI 사업 계획서 만들기</Typography>
          </Button>
        </div>
      </selectBoxModal.Modal>
    );
  };

  const UploadModal = () => {
    const [question, setQuestion] = React.useState<string>("");
    const setQuestionAtStorage = useSetAtom(questionAtom);
    const [characterLimit, setCharacterLimit] = React.useState<number>(0);
    const [contentToInclude, setContentToInclude] = React.useState<string>("");
    const [noteWhenWriting, setNoteWhenWriting] = React.useState<string>("");
    const [answerType, setAnswerType] = React.useState<string>("descriptive");

    return (
      <uploadModal.Modal>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4">사업 계획서 항목 별로 작성하기</Typography>
          <Empty height="1rem" />
          <Typography>학습시킬 사업 계획서의 문항을 입력해주세요.</Typography>
          <TextField
            placeholder="ex) 사업 개요"
            onChange={(e) => {
              setQuestion(e.target.value);
              setQuestionAtStorage([e.target.value]);
            }}
          />
          <Empty height="2rem" />{" "}
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <Typography>희망 글자수</Typography>
            <Typography variant="caption">(숫자만 입력해주세요!)</Typography>
          </div>
          <TextField
            type="number"
            placeholder="ex) 500"
            onChange={(e) => setCharacterLimit(Number(e.target.value))}
          />
          <Empty height="2rem" />
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <Typography>필수 내용</Typography>
            <Typography variant="caption">(","를 이용해 필수 내용을 구분해주세요!)</Typography>
          </div>
          <TextField
            placeholder={`ex) 제작목표, 제작 내용 및 제작 범위, 소요 기간, 제작 방법(자체,외주)`}
            onChange={(e) => setContentToInclude(e.target.value)}
          />
          <Empty height="2rem" />
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <Typography>조건 </Typography>
            <Typography variant="caption">(","를 이용해 조건을 구분해주세요!)</Typography>
          </div>
          <TextField
            placeholder={`ex) 20년 베테랑 CEO의 역할을 맡았다고 생각하고 작성, 꼼꼼하게 작성`}
            onChange={(e) => setNoteWhenWriting(e.target.value)}
          />
          <Empty height="2rem" />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <Typography>응답 형식</Typography>
              <Typography variant="caption">
                (서술형이면 자세히, 요약형이면 간단히 출력이 됩니다.)
              </Typography>
            </div>
            <RadioGroup row onChange={(e) => setAnswerType(e.target.value)} defaultValue={'descriptive'}>
              <FormControlLabel value="descriptive" control={<Radio size="small" />} label="서술형" />
              <FormControlLabel value="summary" control={<Radio size="small" />} label="요약형" />
            </RadioGroup>
          </div>
          <Empty height="5rem" />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              sx={{ width: "50%", height: "4rem" }}
              onClick={() => {
                const referenceFileIds = posts
                .map((post, i) => (isSelectedProposalList[i] ? String(post.id) : null))
                .filter((id) => id !== null) as string[];
                mutGenerateProposalByOneContents.mutate({
                  referenceFileIds,
                  question,
                  contentsToInclude: contentToInclude.split(","),
                  characterLimit: String(characterLimit),
                  noteWhenWriting: noteWhenWriting.split(","),
                  answerType,
                });
              }}
            >
              AI 사업계획서 답변받기
            </Button>
          </div>
        </div>
      </uploadModal.Modal>
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
      mutPostGenerateProposalSummary.isLoading ||
      mutPostAnswerProposal.isLoading ||
      mutGenerateProposalByOneContents.isLoading,
    onDelete,
    isSummaryLoading: mutSummaizePdf.isLoading,
    Alert,
    SuccessAlert,
    SummaryModal,
    SelectBoxModal,
    UploadModal,
    openUploadModal: uploadModal.handleOpen,
  };
};
