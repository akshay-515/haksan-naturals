import { apiClient } from "./Client"; 
import type {
  AuthResponse,
  OtpRequest,
  OtpVerifyRequest,
} from "../types/auth";

const requestOtp = async (request: OtpRequest) => {
  await apiClient.post<void>(
    "/api/auth/customer/otp/request",
    request
  );
};

const verifyOtp = async (request: OtpVerifyRequest) => {
  const response = await apiClient.post<AuthResponse>(
    "/api/auth/customer/otp/verify",
    request
  );

  return response.data;
};

export { requestOtp, verifyOtp };