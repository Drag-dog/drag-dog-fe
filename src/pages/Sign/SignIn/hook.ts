import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { isEmail, isRequired } from "../../../lib/utils/validation";
import { createControlledReg } from "../../../lib/utils/createControlledReg";
import { useMutation } from "react-query";
import { PropsSign, userApi } from "../../../apis/user";
import { useAlert } from "../../../hooks/useAlert";
import { useSign } from "../../../hooks/useSign";

const ID = "id";
const PW = "password";

export const useSignIn = () => {
  const { control, handleSubmit, setValue, getValues } = useForm();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = React.useState(false);
  const createReg = createControlledReg(control);
  const { openAlert, Alert } = useAlert();
  const { setLoginStateSignIn } = useSign();
  const mutation = useMutation({
    mutationFn: async ({ email, password }: PropsSign) => {
      return await userApi.signIn({ email, password });
    },
    onSuccess: (res) => {
      setLoginStateSignIn(res.data.accessToken);
      navigate("/upload");
    },
    onError: () => {
      openAlert();
    },
  });

  const reg = {
    email: createReg(ID, {
      validate: { isEmail: (val: string) => isEmail(val) || "이메일 형식이 올바르지 않습니다." },
    }),
    password: createReg(PW, {
      validate: { isRequired: (val: string) => isRequired(val) || "비밀번호를 입력해야 합니다." },
    }),
  };

  const onSubmit = handleSubmit(async (data) => {
    const { id, password } = data;
    localStorage.setItem(ID, isChecked ? getValues(ID) : "");
    mutation.mutate({ email: id, password });
  });

  const toggleSaveId = () => {
    setIsChecked((prev) => !prev);
  };

  React.useEffect(() => {
    const savedId = localStorage.getItem(ID);
    savedId && setValue(ID, savedId);
  }, [setValue]);

  return { reg, onSubmit, setValue, toggleSaveId, navigate, Alert };
};
