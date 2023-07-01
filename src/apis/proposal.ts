import axios, { AxiosRequestConfig } from "axios";
import { ENV } from "../constants/env";

const ROUTE = "api/proposals";
const authInstance = axios.create({
  baseURL: ENV.BASE_URL,
});

const authorizationHeader = (accessToken: string): AxiosRequestConfig => {
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

  const response = await authInstance.post(`${ROUTE}`, formData, { ...pdfHeader(accessToken) });

  return response.data;
};

const getProposalKeyList = async ({ accessToken }: { accessToken: string }) => {
  const response = await authInstance.get(`${ROUTE}/keys`, {
    ...authorizationHeader(accessToken),
  });

  return response.data;
};

const postSummarizePdf = async ({ accessToken, file }: { accessToken: string; file: File }) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const response = await authInstance.post(`${ROUTE}/pdf/summarize`, formData, {
    ...pdfHeader(accessToken),
  });
  return response.data;
};

const getProposalInfoList = async ({ accessToken }: { accessToken: string }) => {
  const response = await authInstance.get(`${ROUTE}/file-infos`, {
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
  await authInstance.delete(`${ROUTE}/summary?ids=${proposalKey}`, {
    ...authorizationHeader(accessToken),
  });
};

export const proposalApi = {
  getProposalKeyList,
  postSummarizePdf,
  getProposalInfoList,
  postGenerateProposal,
  deleteProposalSummary,
};
