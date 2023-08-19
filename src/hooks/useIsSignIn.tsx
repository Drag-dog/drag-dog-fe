import React from "react";
import { accessTokenAtom } from "../store/atoms";
import { useAtomValue } from "jotai";
import { LOGIN_STATE } from "../constants/enum";

export const useIsSignIn = () => {
  const isSignIn = useAtomValue(accessTokenAtom);
  const [loginState, setLoginState] = React.useState<LOGIN_STATE>(LOGIN_STATE.UNKNOWN);
  React.useLayoutEffect(() => {
    if (isSignIn === "" || !isSignIn) setLoginState(LOGIN_STATE.NOT_LOGGED_IN);
    else if (isSignIn === "default") setLoginState(LOGIN_STATE.UNKNOWN);
    else setLoginState(LOGIN_STATE.LOGGED_IN);
  }, [isSignIn]);
  return { loginState };
};
