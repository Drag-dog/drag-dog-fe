import { Route, Routes as ReactRoutes } from "react-router-dom";

// Pages
import { Main } from "../pages/Main";
import { Upload } from "../pages/Upload";
import { SignIn } from "../pages/Sign/SignIn";
import { SignUp } from "../pages/Sign/SignUp";

export const AppRoutes = () => {
  return (
    <>
      <ReactRoutes>
        <Route path="/" element={<Main />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </ReactRoutes>
    </>
  );
};
