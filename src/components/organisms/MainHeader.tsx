import React from "react";
import { Toolbar, Divider, Stack, Button, Typography } from "@mui/material";
import { Title } from "../molecules/Title";
import PortraitIcon from "@mui/icons-material/Portrait";

type Props = {
  menu?: React.ReactNode[];
};

export const MainHeader = ({ menu }: Props) => {
  return (
    <Toolbar
      variant="dense"
      sx={{
        position: "sticky",
        display: "flex",
        justifyContent: "space-between",
        top: -1,
        backdropFilter: "blur(1px)",
        width: "100%",
      }}
    >
      <Title />

      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
        sx={{ marginLeft: 2, flexGrow: 1 }}
      >
        {menu}
      </Stack>

      <Button>
        <PortraitIcon />
        &nbsp;
        <Typography>내 정보</Typography>
      </Button>
    </Toolbar>
  );
};
