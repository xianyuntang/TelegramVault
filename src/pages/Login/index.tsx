import React, { useEffect, useState } from "react";
import {
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Skeleton,
} from "@mui/material";
import { IpcService } from "../../ipc";
import { IpcChannel, TelegramAuthAction } from "../../shared/interface/ipc";
import {
  ISendCodeRequestData,
  ISendCodeResponseData,
  ISignInRequestData,
  ISignInWithPasswordRequestData,
} from "../../shared/interface/gramjs/auth";
import { useForm, Controller } from "react-hook-form";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsAuth } from "../../actions/auth";

interface ILoginPage {
  className?: string;
}

interface ILoginForm extends ISignInRequestData {
  password?: "";
}

export const Index: React.FC<ILoginPage> = ({ className }) => {
  const ipc = new IpcService();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { control, getValues, setValue } = useForm<ILoginForm>({
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
      const checkAuthResponseData: boolean = await ipc.send(
        IpcChannel.TELEGRAM_AUTH,
        TelegramAuthAction.CHECK_AUTH
      );
      dispatch(setIsAuth(checkAuthResponseData));
      if (checkAuthResponseData) {
        navigate("/");
      }
      setLoading(false);
    })();
  }, []);

  const sendCode = async () => {
    const sendCodeResponseData: ISendCodeResponseData = await ipc.send(
      IpcChannel.TELEGRAM_AUTH,
      TelegramAuthAction.SEND_CODE,
      {
        data: { phoneNumber: getValues("phoneNumber") } as ISendCodeRequestData,
      }
    );
    setValue("phoneCodeHash", sendCodeResponseData.phoneCodeHash);
    setStep(step + 1);
  };

  const signIn = async () => {
    setStep(step + 1);
    const signInResponseData = await ipc.send(
      IpcChannel.TELEGRAM_AUTH,
      TelegramAuthAction.SIGN_IN,
      {
        data: getValues(),
      }
    );

    console.log(signInResponseData);
    console.log(JSON.stringify(signInResponseData));
  };

  const signInWithPassword = async () => {
    const signInWithPasswordResponseData = await ipc.send(
      IpcChannel.TELEGRAM_AUTH,
      TelegramAuthAction.SIGN_IN_WITH_PASSWORD,
      {
        data: {
          password: getValues("password"),
        } as ISignInWithPasswordRequestData,
      }
    );
    if (signInWithPasswordResponseData) {
      navigate("/");
    }
  };

  return (
    <>
      <Grid
        className={className}
        item
        xs={8}
        sm={8}
        md={5}
        component={Paper}
        elevation={1}
        square
      >
        {loading ? (
          <Skeleton className="login-page__skeleton" />
        ) : (
          <Box className="login-page__paper">
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box component="form" className="login-page__form">
              {step == 1 && (
                <>
                  <Box className="login-page__form-item">
                    <Controller
                      control={control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Phone Number"
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                    />
                  </Box>
                  <Box className="login-page__form-item">
                    <Button onClick={sendCode} variant="outlined">
                      Send SMS Code
                    </Button>
                  </Box>
                </>
              )}
              {step == 2 && (
                <>
                  <Box className="login-page__form-item">
                    <Controller
                      control={control}
                      name="phoneCode"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Phone Code"
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                    />
                  </Box>
                  <Box className="login-page__form-item">
                    <Button onClick={signIn} variant="outlined">
                      Sign In
                    </Button>
                  </Box>
                </>
              )}
              {step == 3 && (
                <>
                  <Box className="login-page__form-item">
                    <Controller
                      control={control}
                      name="password"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Password"
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                    />
                  </Box>
                  <Box className="login-page__form-item">
                    <Button onClick={signInWithPassword} variant="outlined">
                      Sign In
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        )}
      </Grid>
    </>
  );
};

export const LoginPage = styled(Index)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

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
