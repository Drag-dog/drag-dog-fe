import {accessTokenAtom} from "../store/atoms";
import {useAtomValue} from "jotai";
import {LOGIN_STATE} from "../constants/enum";

export const useIsSignIn = () => {
  const isSignIn = useAtomValue(accessTokenAtom);
  let loginState;
  if (isSignIn==="" || !isSignIn) loginState=LOGIN_STATE.NOT_LOGGED_IN;
  else if (isSignIn==="default") loginState=LOGIN_STATE.UNKNOWN;
  else  loginState=LOGIN_STATE.LOGGED_IN;
  return {loginState}
};
