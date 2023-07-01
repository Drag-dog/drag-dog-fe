import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useIsSignIn } from "../../hooks/useIsSignIn";
import { proposalApi } from "../../apis/proposal";
import { useAtomValue, useSetAtom } from "jotai";
import { accessTokenAtom, resProposalsAtom } from "../../store/atoms";
import { useAlert } from "../../hooks/useAlert";

export const useUpload = () => {
  const accessToken = useAtomValue(accessTokenAtom);
  const navigate = useNavigate();
  const { openAlert, Alert } = useAlert();
  const [posts, setPosts] = React.useState<{ id: number; name: string }[]>([]);
  const { isSignIn } = useIsSignIn();
  const [summary, setSummary] = React.useState({});
  const setResProposal = useSetAtom(resProposalsAtom);

  const mutGetFileInfoList = useMutation({
    mutationFn: async () => {
      return await proposalApi.getProposalInfoList({ accessToken });
    },
    onSuccess: (res) => {
      setPosts(res.data);
      setIsSelectedProposalList(Array(res.data.length).fill(true));
    },
    onError: () => {
      openAlert();
    },
  });

  const mutSummaizePdf = useMutation({
    mutationFn: async (file: File) => {
      return await proposalApi.postSummarizePdf({ accessToken, file });
    },
    onSuccess: (res) => {
      setSummary(res);
      mutGetFileInfoList.mutate();
    },
    onError: () => {
      openAlert();
    },
  });

  const mutGenerateProposal = useMutation({
    mutationFn: async ({ pdf, referenceFileIds }: { pdf: File; referenceFileIds: number[] }) => {
      return await proposalApi.postGenerateProposal({ accessToken, pdf, referenceFileIds });
    },
    onSuccess: (res) => {
      setResProposal(res);
      navigate("/success");
    },
    onError: () => {
      openAlert();
    },
  });

  const mutDeleteProposalSummary = useMutation({
    mutationFn: async (proposalKey: number) => {
      await proposalApi.deleteProposalSummary({ accessToken, proposalKey });
    },
    onSuccess: () => {
      mutGetFileInfoList.mutate();
    },
    onError: () => {
      openAlert();
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
    onDelete,
    isSummaryLoading: mutSummaizePdf.isLoading,
    isSummarySuccess: mutSummaizePdf.isSuccess,
    isGenerateLoading: mutGenerateProposal.isLoading,
    Alert,
    summary,
  };
};
