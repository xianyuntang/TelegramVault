import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Skeleton, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsAuth } from "../../actions/auth";
import { telegramService } from "../../ipc/service/telegram";
import { SendCodeForm } from "./LoginStep/SendCode";
import { SignInForm } from "./LoginStep/SignIn";
import { SignInWithPasswordForm } from "./LoginStep/SignInWithPassword";

interface ILoginPage {
  className?: string;
}

interface ILoginForm {
  phoneNumber: string;
  phoneCodeHash: string;
  phoneCode: string;
  password: string;
}

export const BaseLoginPage: React.FC<ILoginPage> = ({ className }) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ILoginForm>({
    defaultValues: {
      phoneNumber: "",
      phoneCodeHash: "",
      phoneCode: "",
      password: "",
    },
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const isAuth = await telegramService.checkAuth();
        if (isAuth) {
          dispatch(setIsAuth(isAuth));
          navigate("/");
        }
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const setPhoneCodeHash = (value: string) => {
    setValue("phoneCodeHash", value);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  return (
    <>
      <Grid className={className} component={Paper} elevation={1}>
        {loading ? (
          <Skeleton className="login-page__skeleton" />
        ) : (
          <Box className="login-page__paper">
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            {step === 1 && (
              <SendCodeForm
                setPhoneCodeHash={setPhoneCodeHash}
                nextStep={nextStep}
              />
            )}
            {step === 2 && (
              <SignInForm
                phoneNumber={getValues("phoneNumber")}
                phoneCodeHash={getValues("phoneCodeHash")}
                nextStep={nextStep}
              />
            )}
            {step === 3 && <SignInWithPasswordForm />}
          </Box>
        )}
      </Grid>
    </>
  );
};

export const LoginPage = styled(BaseLoginPage)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  .login-page__skeleton {
    width: 100%;
    height: 100%;
  }

  .login-page__paper {
    margin: 12px 6px;
    display: flex;

    flex-direction: column;
    align-items: center;
    justify-content: center;

    .login-page__form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .login-page__form-item {
        width: 100%;
        margin: 10px;
        text-align: center;
      }
    }
  }
`;
