import { Request, Response } from "express";
import { Appenv } from "../read-env";
import { MemberRepository } from "../member-management/member.repository";
import { drizzle } from "drizzle-orm/mysql2";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

const pool = mysql.createPool(Appenv.DATABASE_URL);
const db = drizzle(pool);
const memberRepository = new MemberRepository(db);

export const googleAuthorize = async (req: Request, res: Response) => {
  console.log("=============> google auth")
  try {
    const code = req.query.code as string;

    if (!code) {
      return res.status(400).json({ message: "Authorization code is required" });
    }

    // Exchange authorization code for tokens
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: Appenv.GOOGLE_CLIENT_ID,
        client_secret: Appenv.GOOGLE_CLIENT_SECRET,
        redirect_uri: "http://localhost:3500/authorize/",
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const { id_token } = data;

    // Validate and decode the id_token
    const decodedToken = jwt.decode(id_token) as {
      email: string;
      name: string;
      sub: string;
    };

    // Generate your own JWT access and refresh tokens
    const newAccessToken = jwt.sign(
      { userId: decodedToken.sub, email: decodedToken.email },
      Appenv.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { userId: decodedToken.sub },
      Appenv.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const existingUser = await memberRepository.getByEmail(decodedToken.email);

    if (existingUser) {
      await memberRepository.update(existingUser.id, {
        refreshToken: newRefreshToken,
        accessToken: newAccessToken,
        user_id: decodedToken.sub,
        email: decodedToken.email,
        firstName: decodedToken.name.split(" ")[0], // Assuming name is in "First Last" format
        lastName: decodedToken.name.split(" ")[1] || "", // Handle cases where last name might be missing
        password: existingUser.password, // You should not store raw passwords. Set this according to your requirements.
        phoneNumber: "1234567890", // Placeholder value, consider using a real value or validation
        role: "user", // Ensure this value fits within your schema constraints
      });

      res.cookie("accessToken", newAccessToken, {
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect("http://localhost:5173/list");
    } else {
      await memberRepository.create({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        email: decodedToken.email,
        firstName: decodedToken.name.split(" ")[0],
        lastName: decodedToken.name.split(" ")[1] || "",
        password: "", // Same as above
        phoneNumber: "1234567890", // Same as above
        role: "user", // Ensure this value fits within your schema constraints
        user_id: decodedToken.sub,
      });

      res.redirect("http://localhost:5173/list");
    }
  } catch (error:any) {
    console.error("Error handling Google OAuth callback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
