import React from "react";
import { HashRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { StyledLoginPage } from "../components/pages/LoginPage";
import { Layout } from "../components/app/Layout";
import { HomePage } from "../components/pages/HomePage";

interface IRequireAuthProps {
  redirect: string;
}

const RequireAuth: React.FC<IRequireAuthProps> = ({ redirect }) => {
  // TODO add login
  const isAuthenticated = false;
  return isAuthenticated ? <Outlet /> : <Navigate to={redirect} />;
};

export const RootRouter: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<RequireAuth redirect="login" />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route path="/login" element={<StyledLoginPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};
