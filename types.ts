
export type TableRow = string[];
export type TableData = TableRow[];

export interface FileData {
  base64: string;
  mimeType: string;
  previewUrl: string | null;
  name: string;
  type: 'image' | 'pdf';
}
