import { atomWithStorage } from "jotai/utils";
import { TOKEN, NAME } from "../constants/enum";

// [Error] 비동기적으로 데이터를 가져와야 함
export const accessTokenAtom = atomWithStorage<string>(TOKEN.ACCESS_TOKEN, "");
export const resProposalsAtom = atomWithStorage<
  (string | { additional?: string[]; answer: string }[])[]
>(NAME.PROPOSAL, []);
export const questionAtom = atomWithStorage<string[]>(NAME.QUESTION, []);
