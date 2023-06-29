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

const getOneProposal = async ({ query, accessToken }: { query: string; accessToken: string }) => {
  const response = await authInstance.get(`${ROUTE}?query=${query}`, {
    ...authorizationHeader(accessToken),
  });

  return response.data;
};

const getProposalKeyList = async ({ accessToken }: { accessToken: string }) => {
  const response = await authInstance.get(`${ROUTE}/keys`, {
    ...authorizationHeader(accessToken),
  });

  return response.data;
};

// const postProposalPdfSummary

const getProposalInfoList = async ({ accessToken }: { accessToken: string }) => {
  const response = await authInstance.get(`${ROUTE}/file-infos`, {
    ...authorizationHeader(accessToken),
  });

  return response.data;
};

export const proposalApi = {
  getOneProposal,
  getProposalKeyList,
  getProposalInfoList,
};
