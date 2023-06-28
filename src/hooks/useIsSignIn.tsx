import React from "react";
import { accessTokenAtom } from "../store/atoms";
import { useAtomValue } from "jotai";

export const useIsSignIn = () => {
  const isSignIn = useAtomValue(accessTokenAtom);

  return { isSignIn };
};
