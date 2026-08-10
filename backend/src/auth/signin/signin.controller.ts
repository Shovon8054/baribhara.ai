import { Request, Response } from "express";
import signInService from "./signin.service.js";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const result = await signInService.login(email, password);

    res.cookie("auth_token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(401).json({
      success: false,
      message,
    });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}
