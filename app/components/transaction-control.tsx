"use client";

import { useState } from "react";
import { PAYMENT_STATUSES } from "../utils/payment-statuses";

const paymentButtons = [
  {
    id: "pix",
    label: "Simulate payment with Pix",
    bg: "bg-green-200",
    success: true,
  },
  {
    id: "stripe",
    label: "Simulate payment with Stripe",
    bg: "bg-blue-200",
    success: true,
  },
  {
    id: "credit",
    label: "Simulate failing payment",
    bg: "bg-red-200",
    success: false,
  },
];

type transaction = {
  type: string;
  amount: number;
  success: boolean;
};

export function TransactionControl() {
  const [status, setStatus] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  async function handleTransaction({ type, amount, success }: transaction) {
    setIsProcessing(true);
    setStatus("Payment is in progress...");

    const eventSource = new EventSource(
      `http://localhost:3000/payment?type=${type}&amount=${amount}&success=${success}`
    );

    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const { status } = data;

      console.log(data);

      switch (status) {
        case PAYMENT_STATUSES.PENDING:
          setStatus("Payment is in progress...");
          break;
        case PAYMENT_STATUSES.IN_TRANSIT:
          setStatus("Payment is in transit...");
          break;
        case PAYMENT_STATUSES.PAID:
          setIsProcessing(false);
          setStatus("Payment completed!");
          eventSource.close();
          break;
        case PAYMENT_STATUSES.CANCELED:
          setIsProcessing(false);
          setStatus("Payment failed!");
          eventSource.close();
          break;
        default:
          setStatus("");
          break;
      }
    };
  }

  return (
    <div>
      <div className="flex flex-col gap-3">
        {paymentButtons.map(({ id, label, bg, success }) => (
          <button
            key={id}
            className={`${bg} text-background rounded-full font-medium py-2 px-4
            disabled:brightness-50 disabled:opacity-50`}
            onClick={() =>
              handleTransaction({ type: id, amount: 101, success })
            }
            disabled={isProcessing}
          >
            {label}
          </button>
        ))}
      </div>

      {status && <div className="mt-4 text-lg font-medium">{status}</div>}
    </div>
  );
}
