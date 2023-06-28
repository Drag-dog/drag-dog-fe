import React from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import { FormHelperText } from "@mui/material";
import { isEmpty } from "../../lib/utils/isEmpty";

type Props<TFieldValues extends FieldValues = FieldValues> = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  errors: FieldErrors<TFieldValues>;
  names: string[];
  children: React.ReactNode;
};

export const InputMulti = ({ errors, names, children, ...props }: Props) => {
  return (
    <div style={{ width: "100%" }}>
      <div {...props}>{children}</div>
      {/* [Todo] 헬퍼 텍스트의 위치가 다른 Input과 잘 안 맞음 */}
      <FormHelperText error={!isEmpty(errors)}>
        {names.map((name) => errors[name]?.message)[0] as string}
      </FormHelperText>
    </div>
  );
};
