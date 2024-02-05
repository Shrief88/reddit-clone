/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URI: string;
  readonly VITE_CLOUDINARY_URL: string;
  readonly VITE_SOCKET_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
