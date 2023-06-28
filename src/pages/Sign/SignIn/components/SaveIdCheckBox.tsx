import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";

type Prop = {
  toggleSaveId: () => void;
};

export const SaveIdCheckBox = ({ toggleSaveId }: Prop) => {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "right" }}>
      <FormControlLabel
        control={<Checkbox onClick={() => toggleSaveId()} />}
        label={<Typography variant="body2">ID 저장</Typography>}
      />
    </div>
  );
};
