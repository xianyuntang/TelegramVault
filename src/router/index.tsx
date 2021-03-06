import React from "react";
import { HashRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/Login";
import { Layout } from "../components/app/Layout";
import { ExplorerPage } from "../pages/Explorer";
import { useSelector } from "react-redux";
import { stateType } from "../reducer";

interface IRequireAuthProps {
  redirect: string;
}

const RequireAuth: React.FC<IRequireAuthProps> = ({ redirect }) => {
  const isAuth = useSelector(
    (state: stateType) => state.authReducer.auth.isAuth
  );
  return isAuth ? <Outlet /> : <Navigate to={redirect} />;
};

export const RootRouter: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<RequireAuth redirect="login" />}>
            <Route path="/" element={<ExplorerPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};
