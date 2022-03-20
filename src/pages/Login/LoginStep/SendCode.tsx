import React from "react";
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { telegramService } from "../../../ipc/service/telegram";
import { ITelegramError } from "../../../shared/interface/gramjs";
import { Box, Button, TextField } from "@mui/material";

interface ISendCodeForm {
  phoneNumber: string;
}

interface ISendCodeFormProps {
  setPhoneCodeHash: (value: string) => void;
  nextStep: () => void;
}

export const SendCodeForm: React.FC<ISendCodeFormProps> = (props) => {
  const { setPhoneCodeHash, nextStep } = props;
  const { handleSubmit, control, getValues } = useForm<ISendCodeForm>({
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit: SubmitHandler<ISendCodeForm> = async (data) => {
    try {
      const response = await telegramService.sendCode({
        phoneNumber: getValues("phoneNumber"),
      });
      setPhoneCodeHash(response.phoneCodeHash);
      nextStep();
    } catch (e) {
      if ((e as ITelegramError).code === 500) {
        await onSubmit(data);
      }
    }
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
            />
          )}
        />
      </Box>
      <Box className="login-page__form-item">
        <Button type="submit"> Send SMS Code</Button>
      </Box>
    </form>
  );
};
