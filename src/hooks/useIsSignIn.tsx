import React from "react";
import { accessTokenAtom } from "../store/atoms";
import { useAtomValue } from "jotai";
import { userApi } from "../apis/user";
import { LOGIN_STATE } from "../constants/enum";

/**
 * @description 로그인 상태를 확인하는 커스텀 훅
 */
export const useIsSignIn = () => {
  const accessToken = useAtomValue(accessTokenAtom);
  const [loginState, setLoginState] = React.useState<LOGIN_STATE>(LOGIN_STATE.UNKNOWN);

  React.useLayoutEffect(() => {
    if (accessToken === "") {
      setLoginState(LOGIN_STATE.UNKNOWN);
    } else {
      userApi.getIsSignIn(accessToken).then(({ data }) => {
        switch (data?.isLoggedIn) {
          case true:
            setLoginState(LOGIN_STATE.LOGGED_IN);
            break;
          case false:
          default:
            setLoginState(LOGIN_STATE.NOT_LOGGED_IN);
            break;
        }
      });
    }
  }, [accessToken]);
  return { loginState };
};
