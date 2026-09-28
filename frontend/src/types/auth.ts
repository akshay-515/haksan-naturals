interface OtpRequest {
  email: string;
}

interface OtpVerifyRequest {
  email: string;
  otp: string;
}

interface AuthResponse {
  token: string;
}

interface JwtPayload {
  sub: string;
  role: "CUSTOMER" | "ADMIN";
  iat: number;
  exp: number;
}

export type {
  OtpRequest,
  OtpVerifyRequest,
  AuthResponse,
  JwtPayload,
};