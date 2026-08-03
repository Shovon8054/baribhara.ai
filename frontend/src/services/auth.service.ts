import api from "../api/axios";

interface RegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "tenant" | "owner";
}

interface LoginUser {
  email: string;
  password: string;
}

export const registerUser = async (user: RegisterUser) => {
  const response = await api.post("/auth/register", user);
  return response.data;
};

export const loginUser = async (user: LoginUser) => {
  const response = await api.post("/auth/login", user);
  return response.data;
};