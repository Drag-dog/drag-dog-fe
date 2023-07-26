import { accessTokenAtom } from "../store/atoms";
import { useAtomValue } from "jotai";

export const useIsSignIn = () => {
  // [Todo] 백엔드 api 호출로 바꾸기
  const isSignIn = useAtomValue(accessTokenAtom);

  return { isSignIn: !!isSignIn };
};
