export interface AppEnv {
  DATABASE_URL: string;
  JWT_SECRET: string;
  REFRESH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_OAUTH_REDIRECT_URL: string;
  NODE_ENV: string;
}

export const Appenv = process.env as unknown as AppEnv;
