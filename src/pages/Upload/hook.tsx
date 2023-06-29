import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useIsSignIn } from "../../hooks/useIsSignIn";
import { proposalApi } from "../../apis/proposal";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "../../store/atoms";
import { useAlert } from "../../hooks/useAlert";

export const useUpload = () => {
  const { isSignIn } = useIsSignIn();
  const accessToken = useAtomValue(accessTokenAtom);
  const navigate = useNavigate();
  const { openAlert, Alert } = useAlert();
  const [posts, setPosts] = React.useState<{ id: number; name: string }[]>([]);

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
    onSuccess: () => {
      mutGetFileInfoList.mutate();
    },
    onError: () => {
      openAlert();
    },
  });

  const mutGenerateProposal = useMutation({
    mutationFn: async ({ pdf, referenceFileIds }: { pdf: File; referenceFileIds: number[] }) => {
      console.log(referenceFileIds);
      return await proposalApi.postGenerateProposal({ accessToken, pdf, referenceFileIds });
    },
    onSuccess: (res) => {
      // [Test]
      console.log(res);
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

  React.useLayoutEffect(() => {
    mutGetFileInfoList.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useLayoutEffect(() => {
    // [Error] 토큰이 있는데 로그인 페이지로 이동하는 문제
    if (!isSignIn) {
      navigate("/sign-in");
    }
  });

  return {
    posts,
    isSelectedProposalList,
    onCheck,
    postSummarizePdf: mutSummaizePdf.mutate,
    generateProposal: mutGenerateProposal.mutate,
    isLoading: mutSummaizePdf.isLoading || mutGenerateProposal.isLoading,
    Alert,
  };
};
