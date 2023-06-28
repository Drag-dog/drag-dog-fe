import { Route, Routes as ReactRoutes } from "react-router-dom";

// Pages
import { Main } from "../pages/Main";

export const AppRoutes = () => {
  return (
    <>
      <ReactRoutes>
        <Route path="/" element={<Main />} />
      </ReactRoutes>
    </>
  );
};
