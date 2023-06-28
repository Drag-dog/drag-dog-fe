import styled from "@emotion/styled";
import { breakPoints } from "../../constants/breakPoints";

export const Form = styled("form")({
  width: "100%",
  maxWidth: breakPoints.sm * 0.6,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});
