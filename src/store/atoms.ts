import { atomWithStorage } from "jotai/utils";
import { TOKEN } from "../constants/enum";

export const qrcodeUrlAtom = atomWithStorage<string>(TOKEN.ACCESS_TOKEN, "");
