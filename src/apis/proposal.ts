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
 * @deprecated
 */
const postGenerateProposal = async ({
  accessToken,
  referenceFileIds,
  pdf,
}: {
  accessToken: string;
  referenceFileIds: number[];
  pdf: File;
}) => {
  const formData = new FormData();
  formData.append("pdf", pdf);
  formData.append("referenceFileIds", JSON.stringify(referenceFileIds));

  const response = await proposalInstance.post(`${ROUTE}`, formData, { ...pdfHeader(accessToken) });

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

const getProposalKeyList = async ({ accessToken }: { accessToken: string }) => {
  const response = await proposalInstance.get(`${ROUTE}/keys`, {
    ...authorizationHeader(accessToken),
  });

  return response.data;
};

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
}) => {
  const response = await proposalInstance.get(`${ROUTE}/summary/${proposalKey}`, {
    ...authorizationHeader(accessToken),
  });

  return response.data;
};

const putProposalSummary = async ({
  accessToken,
  summaryId,
  summaries,
}: {
  accessToken: string;
  summaryId: number;
  summaries: object;
}) => {
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
};

export type PropsPostAnswerProposal = {
  accessToken: string;
  contentsToInclude: string[];
  characterLimit: number;
  referenceFileIds: string[];
  noteWhenWriting: string[];
  question: string;
  answerType: string;
};
