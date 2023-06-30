import { atomWithStorage } from "jotai/utils";
import { TOKEN, NAME } from "../constants/enum";

export const accessTokenAtom = atomWithStorage<string>(TOKEN.ACCESS_TOKEN, "");

export const resProposalsAtom = atomWithStorage<string>(NAME.PROPOSAL, "");
