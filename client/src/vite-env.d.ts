/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URI: string;
  readonly VITE_CLOUDINARY_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
