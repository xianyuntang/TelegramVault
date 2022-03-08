import React, { useEffect, useRef, useState } from "react";
import { Paper, Box, TextField, Button, Grid, Typography } from "@mui/material";
import { IpcService } from "../../ipc";
import { IpcChannel } from "../../shared/ipc/interface";
import {
  ISendCodeRequestData,
  ISendCodeResponseData,
  ISignInRequestData,
} from "../../shared/gramjs";
import { useForm, Controller } from "react-hook-form";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

interface ILoginPage {
  className?: string;
}

export const LoginPage: React.FC<ILoginPage> = ({ className }) => {
  const ipc = new IpcService();
  const [step, setStep] = useState<number>(1);
  const navigate = useNavigate();
  const { control, getValues, setValue } = useForm<ISignInRequestData>({
    defaultValues: {
      phoneNumber: "9996621479",
      phoneCodeHash: "",
      phoneCode: "",
    },
  });
  const sendCode = async () => {
    const sendCodeResponseData: ISendCodeResponseData = await ipc.send(
      IpcChannel.SEND_CODE,
      {
        data: { phoneNumber: getValues("phoneNumber") } as ISendCodeRequestData,
      }
    );
    console.log(sendCodeResponseData);
    setValue("phoneCodeHash", sendCodeResponseData.phoneCodeHash);
    setStep(step + 1);
  };

  const SignIn = async () => {
    const signInResponseData = await ipc.send(IpcChannel.SIGN_IN, {
      data: getValues(),
    });
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
                  <Button onClick={SignIn} variant="outlined">
                    Sign In
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Grid>
    </>
  );
};

export const StyledLoginPage = styled(LoginPage)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

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
