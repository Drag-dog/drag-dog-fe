import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useIsSignIn } from "../../hooks/useIsSignIn";
import { proposalApi } from "../../apis/proposal";
import { useAtomValue, useSetAtom } from "jotai";
import { accessTokenAtom, resProposalsAtom } from "../../store/atoms";
import { useAlert } from "../../hooks/useAlert";
import { useModal } from "../../hooks/useModal";
import ListItem from "@mui/material/ListItem/ListItem";
import Typography from "@mui/material/Typography/Typography";
import { Empty } from "../../components/atoms";

export const useUpload = () => {
  const accessToken = useAtomValue(accessTokenAtom);
  const navigate = useNavigate();
  const { openAlert, Alert } = useAlert();
  const [posts, setPosts] = React.useState<{ id: number; name: string }[]>([]);
  const { isSignIn } = useIsSignIn();
  const [summary, setSummary] = React.useState<{ [key: string]: string }>({});
  const setResProposal = useSetAtom(resProposalsAtom);
  const { handleOpen, Modal } = useModal();

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
    mutationFn: async ({ pdf, referenceFileIds }: { pdf: File; referenceFileIds: number[] }) => {
      return await proposalApi.postGenerateProposal({ accessToken, pdf, referenceFileIds });
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
      handleOpen();
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
      <Modal>
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
      </Modal>
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
    generateProposal: mutGenerateProposal.mutate,
    getPropsalSummary: mutGetPropsalSummary.mutate,
    onDelete,
    isSummaryLoading: mutSummaizePdf.isLoading,
    isGenerateLoading: mutGenerateProposal.isLoading,
    Alert,
    SummaryModal,
  };
};
