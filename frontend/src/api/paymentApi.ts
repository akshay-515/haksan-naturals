import { apiClient } from "./client";
import type {
  PaymentCreateRequest,
  PaymentResponse,
  PaymentVerifyRequest,
  PaymentVerifyResponse,
} from "../types/payment";

const createPayment = async (request: PaymentCreateRequest) => {
  const response = await apiClient.post<PaymentResponse>(
    "/api/payments/create",
    request
  );

  return response.data;
};

const verifyPayment = async (request: PaymentVerifyRequest) => {
  const response = await apiClient.post<PaymentVerifyResponse>(
    "/api/payments/verify",
    request
  );

  return response.data;
};

export {
  createPayment,
  verifyPayment,
};