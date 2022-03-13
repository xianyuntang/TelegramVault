import React from "react";
import { HashRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/Login";
import { Layout } from "../components/app/Layout";
import { HomePage } from "../pages/Home";
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
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};
