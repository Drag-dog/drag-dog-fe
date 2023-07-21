import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useIsSignIn } from "../../hooks/useIsSignIn";
import { PropsPostAnswerProposal, proposalApi } from "../../apis/proposal";
import { useAtomValue, useSetAtom } from "jotai";
import { accessTokenAtom, resProposalsAtom, questionAtom } from "../../store/atoms";
import { useAlert } from "../../hooks/useAlert";
import { useModal } from "../../hooks/useModal";
import ListItem from "@mui/material/ListItem/ListItem";
import Typography from "@mui/material/Typography/Typography";
import { Empty } from "../../components/atoms";
import TextField from "@mui/material/TextField/TextField";
import Button from "@mui/material/Button/Button";
import RadioGroup from "@mui/material/RadioGroup/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel/FormControlLabel";
import Radio from "@mui/material/Radio/Radio";

// [Todo] 리펙터링 필요
export const useUpload = () => {
  const accessToken = useAtomValue(accessTokenAtom);
  const navigate = useNavigate();
  const { openAlert, Alert } = useAlert();
  const [posts, setPosts] = React.useState<{ id: number; name: string }[]>([]);
  const { isSignIn } = useIsSignIn();
  const [summary, setSummary] = React.useState<{ [key: string]: string }>({});
  const setResProposal = useSetAtom(resProposalsAtom);
  const summaryModal = useModal();
  const uploadModal = useModal();

  // [Todo] mutaion이 아닌 query로 변경
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
    onSuccess: (res) => mutGetFileInfoList.mutate(),
    onError: () => openAlert(),
  });

  const mutGenerateProposal = useMutation({
    mutationFn: async ({ ...props }: Omit<PropsPostAnswerProposal, "accessToken">) => {
      uploadModal.handleClose();
      return await proposalApi.postAnswerProposal({ accessToken, ...props });
    },
    onSuccess: (res) => {
      setResProposal(res);
      navigate("/success");
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
      return await proposalApi.getPropsalSummary({ accessToken, proposalKey });
    },
    onSuccess: (res) => {
      setSummary(res.data);
      summaryModal.handleOpen();
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
    return (
      <summaryModal.Modal>
        <Empty height="1rem" />
        {Object.entries(summary).map(([key, value]) => (
          <>
            <ListItem
              key={key}
              sx={{
                flexDirection: "column",
                width: "80%",
                margin: "0 auto",
              }}
            >
              <Typography variant="h5">{key}</Typography>
              <Empty height="0.5rem" />
              <Typography>{value}</Typography>
            </ListItem>
            <Empty height="1rem" />
          </>
        ))}
      </summaryModal.Modal>
    );
  };

  const UploadModal = () => {
    const [question, setQuestion] = React.useState<string>("");
    const setQuestionAtStorage = useSetAtom(questionAtom);
    const [characterLimit, setCharacterLimit] = React.useState<number>(0);
    const [contentToInclude, setContentToInclude] = React.useState<string>("");
    const [noteWhenWriting, setNoteWhenWriting] = React.useState<string>("");
    const [answerType, setAnswerType] = React.useState<string>("");

    return (
      <uploadModal.Modal>
        <Empty height="1rem" />
        <Typography>학습시킬 사업 계획서의 문항을 입력해주세요.</Typography>
        <TextField
          placeholder="ex) 사업 개요"
          onChange={(e) => {
            setQuestion(e.target.value);
            setQuestionAtStorage(e.target.value);
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
          <RadioGroup row onChange={(e) => setAnswerType(e.target.value)}>
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

              mutGenerateProposal.mutate({
                referenceFileIds,
                question,
                contentsToInclude: contentToInclude.split(","),
                characterLimit,
                noteWhenWriting: noteWhenWriting.split(","),
                answerType,
              });
            }}
          >
            AI 사업계획서 답변받기
          </Button>
        </div>
      </uploadModal.Modal>
    );
  };

  const onDelete = (proposalId: number) => {
    mutDeleteProposalSummary.mutate(proposalId);
  };

  React.useLayoutEffect(() => {
    mutGetFileInfoList.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useLayoutEffect(() => {
    // [Error] 토큰이 있는데 로그인 페이지로 이동하는 문제
    if (!isSignIn) navigate("/sign-in");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [Todo] 리팩터링 필요
  return {
    posts,
    isSelectedProposalList,
    onCheck,
    postSummarizePdf: mutSummaizePdf.mutate,
    getPropsalSummary: mutGetPropsalSummary.mutate,
    onDelete,
    isSummaryLoading: mutSummaizePdf.isLoading,
    isGenerateLoading: mutGenerateProposal.isLoading,
    Alert,
    SummaryModal,
    openUploadModal: uploadModal.handleOpen,
    UploadModal,
  };
};
