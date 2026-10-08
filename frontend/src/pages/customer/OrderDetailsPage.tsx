import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../../api/orderApi";
import { createPayment, verifyPayment } from "../../api/paymentApi";
import { loadRazorpay } from "../../utils/razorpay";
import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from "../../types/order";

const OrderStatusBadge = ({
  status,
}: {
  status: OrderStatus;
}) => {
  const config = {
    PENDING: {
      label: "Order pending",
      className: "bg-amber-50 text-amber-700",
      icon: Clock3,
    },
    CONFIRMED: {
      label: "Order confirmed",
      className: "bg-blue-50 text-blue-700",
      icon: CheckCircle2,
    },
    PROCESSING: {
      label: "Processing",
      className: "bg-blue-50 text-blue-700",
      icon: Package,
    },
    SHIPPED: {
      label: "Shipped",
      className: "bg-purple-50 text-purple-700",
      icon: Truck,
    },
    DELIVERED: {
      label: "Delivered",
      className: "bg-green-50 text-green-700",
      icon: CheckCircle2,
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-red-50 text-red-700",
      icon: XCircle,
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
    >
      <Icon size={14} />
      {config.label}
    </span>
  );
};

const PaymentStatusBadge = ({
  status,
}: {
  status: PaymentStatus;
}) => {
  const config = {
    PENDING: {
      label: "Payment pending",
      className: "bg-amber-50 text-amber-700",
    },
    SUCCESS: {
      label: "Payment successful",
      className: "bg-green-50 text-green-700",
    },
    FAILED: {
      label: "Payment failed",
      className: "bg-red-50 text-red-700",
    },
    REFUNDED: {
      label: "Payment refunded",
      className: "bg-purple-50 text-purple-700",
    },
  }[status];

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
};

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError("Invalid order ID.");
        setLoading(false);
        return;
      }

      try {
        const data = await getOrderById(Number(orderId));
        setOrder(data);
      } catch {
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const handlePayment = async () => {
    if (!order) {
      setPaymentError("Order details are not available.");
      return;
    }

    setPaying(true);
    setPaymentError("");

    try {
      const payment = await createPayment({
        orderId: order.orderId,
      });

      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error("Failed to load Razorpay checkout.");
      }

      const options = {
        key: payment.razorpayKeyId,
        amount: payment.amount * 100,
        currency: payment.currency,
        name: "Haksan Naturals",
        description: `Order #${order.orderId}`,
        order_id: payment.razorpayOrderId,

        handler: async (response: RazorpayPaymentResponse) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            const updatedOrder = await getOrderById(order.orderId);
            setOrder(updatedOrder);
          } catch {
            setPaymentError("Payment verification failed.");
          } finally {
            setPaying(false);
          }
        },

        modal: {
          ondismiss: () => {
            setPaymentError("Payment was cancelled.");
            setPaying(false);
          },
        },

        theme: {
          color: "#16a34a",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch {
      setPaymentError("Failed to start payment.");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-56 rounded bg-gray-200" />

            <div className="mt-3 h-4 w-72 rounded bg-gray-200" />

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="space-y-5">
                <div className="h-32 rounded-2xl bg-gray-200" />
                <div className="h-40 rounded-2xl bg-gray-200" />
                <div className="h-60 rounded-2xl bg-gray-200" />
              </div>

              <div className="h-96 rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-700">
              {error || "Order not found."}
            </p>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              Continue Shopping
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </main>
    );
  }

  const isPaymentPending = order.paymentStatus === "PENDING";
  const isPaymentSuccessful = order.paymentStatus === "SUCCESS";

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Header */}
        <div>
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-700"
          >
            <ArrowLeft size={16} />
            Back to orders
          </button>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
                Order details
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Order #{order.orderId}
              </h1>

              <p className="mt-2 text-sm text-gray-600">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>

            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {paymentError && (
          <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">
              {paymentError}
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">

          {/* Main */}
          <div className="space-y-6">

            {/* Payment status */}
            <section
              className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${
                isPaymentSuccessful
                  ? "border-green-200 bg-green-50"
                  : isPaymentPending
                    ? "border-amber-200 bg-amber-50"
                    : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                    isPaymentSuccessful
                      ? "bg-green-100 text-green-700"
                      : isPaymentPending
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isPaymentSuccessful ? (
                    <CheckCircle2 size={23} />
                  ) : (
                    <CreditCard size={22} />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-semibold text-gray-900">
                      Payment
                    </h2>

                    <PaymentStatusBadge
                      status={order.paymentStatus}
                    />
                  </div>

                  {isPaymentSuccessful ? (
                    <p className="mt-2 text-sm leading-6 text-green-800/80">
                      Your payment has been successfully verified.
                      Your order is being processed.
                    </p>
                  ) : isPaymentPending ? (
                    <p className="mt-2 text-sm leading-6 text-amber-800/80">
                      Your order has been created. Complete your
                      payment to confirm the purchase.
                    </p>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Please check the payment status for this order.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Delivery Address */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2">
                <MapPin
                  size={20}
                  className="text-green-700"
                  strokeWidth={1.8}
                />

                <h2 className="text-lg font-semibold text-gray-900">
                  Delivery address
                </h2>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-700">
                {order.shippingAddress}
              </p>
            </section>

            {/* Items */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2">
                <ShoppingBag
                  size={20}
                  className="text-green-700"
                  strokeWidth={1.8}
                />

                <h2 className="text-lg font-semibold text-gray-900">
                  Items
                </h2>
              </div>

              <div className="mt-5 divide-y divide-gray-100">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-5 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-900">
                        {item.productName}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 font-semibold text-gray-900">
                      ₹{item.subtotal}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Trust */}
            <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-5">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-green-700"
                strokeWidth={1.8}
              />

              <div>
                <p className="text-sm font-medium text-gray-900">
                  Secure payment
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Payments are securely processed through Razorpay.
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-gray-900">
              Order summary
            </h2>

            <div className="mt-5 space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span className="min-w-0 text-gray-600">
                    {item.productName} × {item.quantity}
                  </span>

                  <span className="shrink-0 font-medium text-gray-900">
                    ₹{item.subtotal}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-5 border-t border-gray-100" />

            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">
                Total
              </span>

              <span className="text-2xl font-bold text-green-700">
                ₹{order.totalAmount}
              </span>
            </div>

            {isPaymentPending && (
              <button
                type="button"
                onClick={handlePayment}
                disabled={paying}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {paying ? (
                  "Processing..."
                ) : (
                  <>
                    Pay Now
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            )}

            {isPaymentSuccessful && (
              <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                <CheckCircle2 size={18} />
                Payment completed
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="mt-3 w-full rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-green-300 hover:text-green-700"
            >
              Continue Shopping
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export { OrderDetailsPage };