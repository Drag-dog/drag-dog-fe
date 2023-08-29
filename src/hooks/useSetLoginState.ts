import React from "react";
import { useMutation } from "react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { accessTokenAtom, loginStateAtom } from "../store/atoms";
import { userApi } from "../apis/user";
import { LOGIN_STATE } from "../constants/enum";

/**
 * @description 엑세스 토큰을 이용해 로그안 상태를 설정하는 커스텀 훅
 * MainLayout 컴포넌트에서만 사용함으로써 불필요한 api 호출을 막음
 */
export const useSetLoginState = () => {
  const accessToken = useAtomValue(accessTokenAtom);
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setLoginState = useSetAtom(loginStateAtom);
  const mutGetIsSignIn = useMutation({
    mutationFn: async () => {
      const res = await userApi.getIsSignIn(accessToken);
      return res.data;
    },
    onSuccess: (data) => {
      switch (data?.isLoggedIn) {
        case true:
          setLoginState(LOGIN_STATE.LOGGED_IN);
          break;
        case false:
        default:
          setLoginState(LOGIN_STATE.NOT_LOGGED_IN);
          break;
      }
    },
    onError: () => {
      setLoginState(LOGIN_STATE.UNKNOWN);
      setAccessToken("");
    },
  });

  React.useLayoutEffect(() => {
    if (accessToken !== "") mutGetIsSignIn.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);
};
