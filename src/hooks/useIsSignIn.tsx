import { loginStateAtom } from "../store/atoms";
import { useAtomValue } from "jotai";

/**
 * @description 로그인 상태를 확인하는 커스텀 훅
 */
export const useIsSignIn = () => {
  const loginState = useAtomValue(loginStateAtom);
  return { loginState };
};
