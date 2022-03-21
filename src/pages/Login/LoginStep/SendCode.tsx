import React, { useState } from "react";
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { ITelegramError } from "../../../shared/interface/gramjs";
import { Box, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { telegramService } from "../../../ipc/service";

interface ISendCodeForm {
  phoneNumber: string;
}

interface ISendCodeFormProps {
  setPhoneNumber: (value: string) => void;
  setPhoneCodeHash: (value: string) => void;
  nextStep: () => void;
}

export const SendCodeForm: React.FC<ISendCodeFormProps> = (props) => {
  const { setPhoneNumber, setPhoneCodeHash, nextStep } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const { handleSubmit, control, getValues } = useForm<ISendCodeForm>({
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit: SubmitHandler<ISendCodeForm> = async (data) => {
    setLoading(true);
    try {
      const response = await telegramService.sendCode(getValues("phoneNumber"));
      setPhoneNumber(getValues("phoneNumber"));
      setPhoneCodeHash(response.phoneCodeHash);
      nextStep();
    } catch (e) {
      if ((e as ITelegramError).code === 500) {
        await onSubmit(data);
      }
    }
    setLoading(false);
  };

  const onError: SubmitErrorHandler<ISendCodeForm> = async (errors) => {
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
          name="phoneNumber"
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Phone Number"
              variant="outlined"
              fullWidth
              disabled={loading}
            />
          )}
        />
      </Box>
      <Box className="login-page__form-item">
        <LoadingButton type="submit" variant="contained" loading={loading}>
          {"Send SMS Code"}
        </LoadingButton>
      </Box>
    </form>
  );
};
