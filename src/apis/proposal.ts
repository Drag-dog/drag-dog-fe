import axios, { AxiosRequestConfig } from "axios";
import { ENV } from "../constants/env";

const ROUTE = "api/proposals";
const proposalInstance = axios.create({
  baseURL: ENV.BASE_URL,
});

export const authorizationHeader = (accessToken: string): AxiosRequestConfig => {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

const pdfHeader = (accessToken: string): AxiosRequestConfig => {
  return {
    headers: {
      "Content-Type": "multipart/form-data",
      ...authorizationHeader(accessToken).headers,
    },
  };
};

/**
 * @description 빈 사업계획서에서 사업계획서 요약본을 생성
 * 요약본 생성 후, for문을 돌려 새로운 사업계획서 작성 api를 호출할 것임
 */
const postGenerateProposalSummary = async ({
  accessToken,
  pdf,
}: {
  accessToken: string;
  pdf: File;
}): Promise<ResPostGenerateProposalSummary> => {
  const formData = new FormData();
  formData.append("pdf", pdf);

  const response = await proposalInstance.post(`${ROUTE}/summarize/empty`, formData, {
    ...pdfHeader(accessToken),
  });

  return response.data;
};

const postAnswerProposal = async ({
  accessToken,
  contentsToInclude,
  characterLimit,
  referenceFileIds,
  noteWhenWriting,
  question,
  answerType,
}: PropsPostAnswerProposal) => {
  const response = await proposalInstance.post(
    `${ROUTE}/answer`,
    {
      contentsToInclude,
      characterLimit,
      referenceFileIds,
      noteWhenWriting,
      question,
      answerType,
    },
    { ...authorizationHeader(accessToken) }
  );
  return response.data;
};

/**
 * @description 사업계획서 키 리스트를 가져옴
 */
const getProposalKeyList = async ({ accessToken }: { accessToken: string }) => {
  const response = await proposalInstance.get(`${ROUTE}/keys`, {
    ...authorizationHeader(accessToken),
  });

  return response.data;
};

/**
 * @description 이미 요약된 사업계획서 정보들을 검색
 */
const getSearchContents = async ({
  accessToken,
  query,
}: {
  accessToken: string;
  query: string;
}) => {
  const response = await proposalInstance.get(`${ROUTE}?query=${query}`, {
    ...authorizationHeader(accessToken),
  });

  return response.data;
};

const postSummarizePdf = async ({ accessToken, file }: { accessToken: string; file: File }) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const response = await proposalInstance.post(`${ROUTE}/pdf/summarize`, formData, {
    ...pdfHeader(accessToken),
  });
  return response.data;
};

const getProposalInfoList = async ({ accessToken }: { accessToken: string }) => {
  const response = await proposalInstance.get(`${ROUTE}/file-infos`, {
    ...authorizationHeader(accessToken),
  });

  return response.data;
};

const deleteProposalSummary = async ({
  accessToken,
  proposalKey,
}: {
  accessToken: string;
  proposalKey: number;
}) => {
  await proposalInstance.delete(`${ROUTE}/summary?ids=${proposalKey}`, {
    ...authorizationHeader(accessToken),
  });
};

const getPropsalSummary = async ({
  accessToken,
  proposalKey,
}: {
  accessToken: string;
  proposalKey: number;
}): Promise<{ data: ProposalSummaryObj }> => {
  const response = await proposalInstance.get(`${ROUTE}/summary/${proposalKey}`, {
    ...authorizationHeader(accessToken),
  });

  return response.data;
};

const putProposalSummary = async ({
  accessToken,
  summaryId,
  summaries,
}: PropsPutProposalSummary) => {
  const response = await proposalInstance.put(
    `${ROUTE}/proposals/${summaryId}`,
    { summaries },
    { ...authorizationHeader(accessToken) }
  );
  return response.data;
};

export const proposalApi = {
  getProposalKeyList,
  postSummarizePdf,
  getProposalInfoList,
  getPropsalSummary,
  deleteProposalSummary,
  postAnswerProposal,
  getSearchContents,
  putProposalSummary,
  postGenerateProposalSummary,
};

export type PropsPostAnswerProposal = {
  accessToken: string;
  contentsToInclude?: string[];
  characterLimit?: string;
  referenceFileIds?: string[];
  noteWhenWriting?: string[];
  question?: string;
  answerType?: string;
};

export type ResPostGenerateProposalSummary = {
  [key: number]: {
    characterLimit?: string;
    contentsToInclude?: string[];
    noteWhenWriting?: string[];
    question?: string;
  };
};

export type ProposalSummaryObj = { [key: string]: string[] };

type PropsPutProposalSummary = {
  accessToken: string;
  summaryId: string;
  summaries: ProposalSummaryObj;
};
