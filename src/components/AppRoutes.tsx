import { Route, Routes as ReactRoutes } from "react-router-dom";

// Pages
import { Main } from "../pages/Main";
import { Upload } from "../pages/Upload";

export const AppRoutes = () => {
  return (
    <>
      <ReactRoutes>
        <Route path="/" element={<Main />} />
        <Route path="/upload" element={<Upload />} />
      </ReactRoutes>
    </>
  );
};
