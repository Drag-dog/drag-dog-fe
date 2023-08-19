import React from "react";
import { accessTokenAtom } from "../store/atoms";
import { useAtomValue } from "jotai";
import { LOGIN_STATE } from "../constants/enum";
import { userApi } from "../apis/user";

export const useIsSignIn = () => {
  const accessToken = useAtomValue(accessTokenAtom);
  const [loginState, setLoginState] = React.useState<LOGIN_STATE>(LOGIN_STATE.UNKNOWN);
  React.useLayoutEffect(() => {
    if (accessToken === LOGIN_STATE.UNKNOWN) return;
    else {
      userApi.getIsSignIn(accessToken).then(({ data }) => {
        console.log(data);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { loginState };
};
