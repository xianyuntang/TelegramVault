import React, { useState } from "react";
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ITelegramError } from "../../../shared/interface/gramjs";
import { LoadingButton } from "@mui/lab";
import { telegramService } from "../../../ipc/service";

interface ISignInForm {
  phoneNumber: string;
  phoneCodeHash: string;
  phoneCode: string;
}

interface ISignInFormProps {
  nextStep: () => void;
  phoneNumber: string;
  phoneCodeHash: string;
}

export const SignInForm: React.FC<ISignInFormProps> = (props) => {
  const { nextStep } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { phoneNumber, phoneCodeHash } = props;
  const { handleSubmit, control, getValues } = useForm<ISignInForm>({
    defaultValues: {
      phoneNumber: phoneNumber,
      phoneCodeHash: phoneCodeHash,
      phoneCode: "",
    },
  });

  const onSubmit: SubmitHandler<ISignInForm> = async (data) => {
    setLoading(true);
    try {
      const { phoneNumber, phoneCode, phoneCodeHash } = getValues();
      await telegramService.signIn(phoneNumber, phoneCodeHash, phoneCode);
      navigate("/");
    } catch (e) {
      if ((e as ITelegramError).code === 401) {
        nextStep();
      }
    }
    setLoading(false);
  };

  const onError: SubmitErrorHandler<ISignInForm> = async (errors) => {
    console.log(errors);
  };

  return (
    <form
      className="login-page__form"
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <Box className="login-page__form-item">
        <Controller
          control={control}
          name="phoneCode"
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Phone Code"
              variant="outlined"
              disabled={loading}
              fullWidth
            />
          )}
        />
      </Box>
      <Box className="login-page__form-item">
        <LoadingButton type="submit" variant="contained" loading={loading}>
          {"Sign In"}
        </LoadingButton>
      </Box>
    </form>
  );
};
