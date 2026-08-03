import { Request, Response } from "express";
import signInService from "./signin.service";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const result = await signInService.login(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
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