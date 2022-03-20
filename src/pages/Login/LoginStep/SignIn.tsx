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
  const navigate = useNavigate();
  const { phoneNumber, phoneCodeHash } = props;
  const {
    handleSubmit,
    control,
    getValues,
  } = useForm<ISignInForm>({
    defaultValues: {
      phoneNumber: phoneNumber,
      phoneCodeHash: phoneCodeHash,
      phoneCode: "",
    },
  });

  const onSubmit: SubmitHandler<ISignInForm> = async (data) => {
    try {
      await telegramService.signIn(getValues());
      navigate("/");
    } catch (e) {
      nextStep();
    }
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
              fullWidth
            />
          )}
        />
      </Box>
      <Box className="login-page__form-item">
        <Button type="submit"> Sign In</Button>
      </Box>
    </form>
  );
};
