import { TypographyOptions } from "@mui/material/styles/createTypography";
import { appColor } from "../appColor";

export const configMuiTypography: TypographyOptions = {
  fontFamily: ["SpoqaHanSansNeo-Regular", "sans-serif"].join(","),
  h1: { fontSize: 36, fontWeight: 700 },
  h2: { fontSize: 26 },
  body1: {
    fontSize: 16,
    letterSpacing: "1px",
  },
  body2: { fontSize: 12, fontWeight: 500 },
  button: { fontSize: 16, letterSpacing: "1px", color: appColor.white },
};
