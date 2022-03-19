export interface IDirectoryEntity {
  parentId: number | null;
  id?: number;
  name: string;
  expand?: boolean;
  children?: IDirectoryEntity[];
}
