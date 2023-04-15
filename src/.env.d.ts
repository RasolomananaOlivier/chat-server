declare namespace NodeJs {
  interface ProcessEnv {
    readonly SECRET_KEY: string;
    readonly NODE_ENV: "development" | "production";
  }
}
