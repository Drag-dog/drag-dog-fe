import { useForm } from "react-hook-form";
import { createControlledReg } from "../../../lib/utils/createControlledReg";
import {
  isRequired,
  isEngAndNum,
  isSpecialCharactors,
  isMinLength,
  isEmail,
} from "../../../lib/utils/validation";
import { PropsSign, userApi } from "../../../apis/user";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../hooks/useAlert";
import React from "react";

const EMAIL = "email";
const PW = "password";
const CONFIRM_PW = "confirm_password";

export const useSignUp = () => {
  const navigate = useNavigate();
  const { openAlert, Alert } = useAlert();
  const mutation = useMutation({
    mutationFn: async ({ email, password }: PropsSign) => {
      return await userApi.signUp({ email, password });
    },
    onSuccess: () => {
      navigate("/sign-in");
    },
    onError: (e: any) => openAlert({ contents: e.message, severity: "error" }),
  });

  React.useEffect(() => {}, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const createReg = createControlledReg(control);

  const reg = {
    email: createReg(EMAIL, {
      validate: {
        isRequired: (val: string) => isRequired(val) || "이메일을 입력해야 합니다.",
        isEmail: (val: string) => isEmail(val) || "이메일 형식이 올바르지 않습니다.",
      },
    }),
    password: createReg(PW, {
      validate: {
        isMinLength8: (val: string) => isMinLength(val, 8) || "비밀번호는 8자 이상이어야 합니다.",
        isEngAndNum: (val: string) => isEngAndNum(val) || "영문자와 숫자 조합이어야 합니다.",
        isSpecialCharactors: (val: string) =>
          isSpecialCharactors(val) || "특수 문자가 포함되어야 합니다.",
      },
    }),
    confirmPassword: createReg(CONFIRM_PW, {
      validate: {
        isRequired: (val: string) => isRequired(val) || "비밀번호 확인을 해야 합니다.",
        isConsistent: (val: string) => getValues(PW) === val || "비밀번호가 일치하지 않았습니다.",
      },
    }),
  };

  const onSubmit = handleSubmit(async (data) => {
    const { email, password } = data;
    mutation.mutate({ email, password });
  });

  return { isLoading: mutation.isLoading, reg, errors, onSubmit, Alert };
};
