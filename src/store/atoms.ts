import { atomWithStorage } from "jotai/utils";
import { TOKEN, NAME, LOGIN_STATE } from "../constants/enum";
import { atom } from "jotai";

export const accessTokenAtom = atomWithStorage<string>(TOKEN.ACCESS_TOKEN, "");

export const loginStateAtom = atom<LOGIN_STATE>(LOGIN_STATE.UNKNOWN);

export const resProposalsAtom = atomWithStorage<
  (string | { additional?: string[]; answer: string }[])[]
>(NAME.PROPOSAL, []);

export const questionAtom = atomWithStorage<string[]>(NAME.QUESTION, []);
