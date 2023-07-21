import { atomWithStorage } from "jotai/utils";
import { TOKEN, NAME } from "../constants/enum";

export const accessTokenAtom = atomWithStorage<string>(TOKEN.ACCESS_TOKEN, "");

export const resProposalsAtom = atomWithStorage<{ additional: string[]; answer: string }[]>(
  NAME.PROPOSAL,
  []
);

export const questionAtom = atomWithStorage<string>(NAME.QUESTION, "");
