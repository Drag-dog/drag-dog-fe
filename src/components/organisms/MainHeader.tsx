import React from "react";
import { Toolbar, Divider, Stack, Button, Typography } from "@mui/material";
import { Title } from "../molecules/Title";
import PortraitIcon from "@mui/icons-material/Portrait";
import { useIsSignIn } from "../../hooks/useIsSignIn";
import { useNavigate } from "react-router-dom";

type Props = {
  menu?: React.ReactNode[];
};

export const MainHeader = ({ menu }: Props) => {
  const { isSignIn } = useIsSignIn();
  const navigate = useNavigate();
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

      {isSignIn ? (
        <Button onClick={() => navigate("/profile")}>
          <PortraitIcon />
          &nbsp;
          <Typography>내 정보</Typography>
        </Button>
      ) : (
        <Button onClick={() => navigate("/sign-in")}>
          <PortraitIcon />
          &nbsp;
          <Typography>로그인</Typography>
        </Button>
      )}
    </Toolbar>
  );
};
