export interface AppEnv {
  DATABASE_URL: string;
}

export const Appenv = process.env as unknown as AppEnv;
console.log(Appenv.DATABASE_URL);
