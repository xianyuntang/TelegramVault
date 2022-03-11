export const parseFile = (
  file: File,
  callback: (filePart: number, bytes: string) => void
) => {
  let fileSize: number = file.size;
  let filePart: number = 0;
  let chunkSize: number = 1024 * 512;
  let offset: number = 0;

  const readEventHandler = (evt: ProgressEvent<FileReader>) => {
    if (evt.target?.error === null) {
      offset += (evt.target.result as string).length;
      filePart += 1;
      callback(filePart, evt.target.result as string);
    } else {
      return;
    }
    if (offset >= fileSize) {
      return;
    }

    chunkReaderBlock(offset, chunkSize, file);
  };
  const chunkReaderBlock = (_offset: number, length: number, _file: Blob) => {
    let r = new FileReader();
    let blob = _file.slice(_offset, length + _offset);
    r.onload = readEventHandler;
    r.readAsText(blob);
  };
  chunkReaderBlock(offset, chunkSize, file);
};
