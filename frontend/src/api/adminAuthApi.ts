import { apiClient } from "./client";
import type { AuthResponse } from "../types/auth";

interface AdminLoginRequest {
  email: string;
  password: string;
}

const adminLogin = async (request: AdminLoginRequest) => {
  const response = await apiClient.post<AuthResponse>(
    "/api/auth/admin/login",
    request
  );

  return response.data;
};

export { adminLogin };
export type { AdminLoginRequest };