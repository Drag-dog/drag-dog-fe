import axios from "axios";
import { ENV } from "../constants/env";

const ROUTE = "api/users";
const authInstance = axios.create({
  baseURL: ENV.BASE_URL,
});

const signIn = async ({ email, password }: PropsSign) => {
  const response = await authInstance.post(`${ROUTE}/sign-in/email`, {
    email,
    password,
  });

  return response.data;
};

const signUp = async ({ email, password }: PropsSign) => {
  const response = await authInstance.post(`${ROUTE}/sign-up/email`, {
    email,
    password,
  });

  return response.data;
};

export const userApi = {
  signIn,
  signUp,
};

export type PropsSign = {
  email: string;
  password: string;
};
