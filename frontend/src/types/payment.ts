interface PaymentCreateRequest {
  orderId: number;
}

interface PaymentResponse {
  amount: number;
  currency: string;
  orderId: number;
  paymentId: number;
  razorpayKeyId: string;
  razorpayOrderId: string;
  status: string;
}

interface PaymentVerifyRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

// interface PaymentVerifyResponse {
//   paymentId: number;
//   orderId: number;
//   status: string;
// }

type PaymentVerifyResponse = string;

export type {
  PaymentCreateRequest,
  PaymentResponse,
  PaymentVerifyRequest,
  PaymentVerifyResponse,
};