import { LOGIN_STATE } from "../constants/enum";
import { accessTokenAtom, loginStateAtom } from "../store/atoms";
import { useAtomValue, useSetAtom } from "jotai";

// [Todo] 사용이 조금 복잡한 경향이 있음. 이름 수정 필요할 듯
/**
 * @description 로그인 상태를 확인하는 커스텀 훅
 * 로그인, 로그아웃에서 엑세스 토큰 상태와 로그인 상태를 관리
 */
export const useLoginState = () => {
  const loginState = useAtomValue(loginStateAtom);
  const setLoginState = useSetAtom(loginStateAtom);
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setLoginStateSignIn = (accessToken: string) => {
    setAccessToken(accessToken);
    setLoginState(LOGIN_STATE.LOGGED_IN);
  };
  const setLoginStateSignOut = () => {
    setAccessToken("");
    setLoginState(LOGIN_STATE.NOT_LOGGED_IN);
  };

  return { loginState, setLoginStateSignIn, setLoginStateSignOut };
};
