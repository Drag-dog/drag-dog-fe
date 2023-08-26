import { LOGIN_STATE } from "../constants/enum";
import { accessTokenAtom, loginStateAtom } from "../store/atoms";
import { useAtomValue, useSetAtom } from "jotai";

/**
 * @description 로그인 상태를 확인하는 커스텀 훅
 */
export const useLoginState = () => {
  const loginState = useAtomValue(loginStateAtom);
  const setLoginState = useSetAtom(loginStateAtom);
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setLoginStateSignIn = () => setLoginState(LOGIN_STATE.LOGGED_IN);
  const setLoginStateSignOut = () => {
    setAccessToken("");
    setLoginState(LOGIN_STATE.NOT_LOGGED_IN);
  };

  return { loginState, setLoginStateSignIn, setLoginStateSignOut };
};
