import React, { useState } from "react";
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { databaseService, telegramService } from "../../../ipc/service";

interface ISignInWithPasswordForm {
  password: string;
}

interface SignInWithPasswordFormProps {
  // setPassword: (value: string) => void;
}

export const SignInWithPasswordForm: React.FC<SignInWithPasswordFormProps> = (
  props
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { handleSubmit, control, getValues } = useForm<ISignInWithPasswordForm>(
    {
      defaultValues: {
        password: "",
      },
    }
  );

  const onSubmit: SubmitHandler<ISignInWithPasswordForm> = async (data) => {
    setLoading(true);
    try {
      await telegramService.signInWithPassword(getValues("password"));
      await databaseService.fetchDatabase();
      navigate("/");
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const onError: SubmitErrorHandler<ISignInWithPasswordForm> = async (
    errors
  ) => {
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
          name="password"
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              variant="outlined"
              type="password"
              disabled={loading}
              fullWidth
            />
          )}
        />
      </Box>
      <Box className="login-page__form-item">
        <LoadingButton type="submit" variant="contained" loading={loading}>
          {"Sign In With Password"}
        </LoadingButton>
      </Box>
    </form>
  );
};

