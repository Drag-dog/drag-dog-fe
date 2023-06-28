import { atomWithStorage } from "jotai/utils";
import { TOKEN } from "../constants/enum";

export const accessTokenAtom = atomWithStorage<string>(TOKEN.ACCESS_TOKEN, "");
