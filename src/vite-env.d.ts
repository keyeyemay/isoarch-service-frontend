interface ImportMetaEnv {
  readonly VITE_DATA_SOURCE?: "mock" | "api";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
