import React, { ChangeEvent, useRef, useState } from "react";
import { StyledProps } from "../../shared/interface/component";
import { Box, Button, Grid, Input, Paper, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import {
  ISaveFilePartRequestData,
  ISaveFilePartResponseData,
} from "../../shared/interface/gramjs/file";
import { IpcService } from "../../ipc";
import { IpcChannel, TelegramFileAction } from "../../shared/interface/ipc";
import { parseFile } from "../uploader/utils";

export const HomePage: React.FC<StyledProps> = ({ className }) => {
  const ipc = new IpcService();
  const { control, getValues, setValue } = useForm<ISaveFilePartRequestData>();
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = () => {
    const fileId = BigInt("-11114546458798452");
    parseFile(files[0], async (filePart, bytes) => {
      const result: ISaveFilePartResponseData = await ipc.send(
        IpcChannel.TELEGRAM_FILE,
        TelegramFileAction.SAVE_FILE_PART,
        {
          data: {
            fileId: fileId,
            filePart: filePart,
            bytes: bytes,
          } as ISaveFilePartRequestData,
        }
      );
      console.log(result);
    });
  };

  const fileOnChange = ({
    currentTarget: { files },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (files && files.length) {
      setFiles((existing) => existing.concat(Array.from(files)));
    }
  };

  return (
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
      <Box component="form" className="home-page__form">
        <Input onChange={fileOnChange} ref={inputRef} type="file" />
        <Button onClick={upload}>Submit</Button>
      </Box>
    </Grid>
  );
};
