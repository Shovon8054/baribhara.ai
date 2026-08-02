import api from "../api/axios";

interface RegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "tenant" | "owner";
}

export const registerUser = async (user: RegisterUser) => {
  const response = await api.post("/auth/register", user);
  return response.data;
};