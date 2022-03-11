import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { StyledLoginPage } from "../components/pages/LoginPage";
import { Layout } from "../components/app/Layout";
import { HomePage } from "../components/pages/HomePage";
import { IpcService } from "../ipc";
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
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route path="/login" element={<StyledLoginPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};
