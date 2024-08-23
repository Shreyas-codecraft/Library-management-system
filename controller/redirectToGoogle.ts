import { Request, Response } from "express";
import getGoogleOAuthURL from "./getGoogleURL";
require("dotenv").config();

export const redirectToGoogle = async (req: Request, res: Response) => {
  const url = getGoogleOAuthURL();
  console.log("redirecting to:", url);
  res.json({ redirect: url });
};
