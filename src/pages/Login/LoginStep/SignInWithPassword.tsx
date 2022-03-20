import React from "react";
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { telegramService } from "../../../ipc/service/telegram";
import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ISignInWithPasswordForm {
  password: string;
}

interface SignInWithPasswordFormProps {
  // setPassword: (value: string) => void;
}

export const SignInWithPasswordForm: React.FC<SignInWithPasswordFormProps> = (
  props
) => {
  // const {setPassword} = props;
  const navigate = useNavigate();
  const { handleSubmit, control, getValues } = useForm<ISignInWithPasswordForm>(
    {
      defaultValues: {
        password: "",
      },
    }
  );

  const onSubmit: SubmitHandler<ISignInWithPasswordForm> = async (data) => {
    try {
      await telegramService.signInWithPassword({
        password: getValues("password"),
      });
      navigate("/");
    } catch (e) {
      console.log(e)
    }
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
              fullWidth
            />
          )}
        />
      </Box>
      <Box className="login-page__form-item">
        <Button type="submit"> Sign In With Password</Button>
      </Box>
    </form>
  );
};

