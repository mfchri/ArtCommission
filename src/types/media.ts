export interface MediaItem {
  id: string;
  name: string;
  url: string;
  storagePath: string;
  sizeBytes: number;
  mimeType: string;
  createdAt: string;
  inUse?: boolean;
}
