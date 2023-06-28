import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export const Title = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant="text"
      component="h1"
      sx={{
        fontSize: "2rem",
      }}
      onClick={() => navigate("/")}
    >
      Drag dog
    </Button>
  );
};
