"use client";

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

async function handleTransaction({ type, amount, success }: transaction) {
  const eventSource = new EventSource(
    `http://localhost:3000/payment?type=${type}&amount=${amount}&success=${success}`
  );

  eventSource.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console.log(data);

    if (
      data.status === PAYMENT_STATUSES.PAID ||
      data.status === PAYMENT_STATUSES.CANCELED
    ) {
      eventSource.close();
      console.log("Connection closed");
    }
  };
}

export function PaymentButtons() {
  return (
    <div className="flex flex-col gap-3">
      {paymentButtons.map(({ id, label, bg, success }) => (
        <button
          key={id}
          className={`${bg} text-background rounded-full font-medium py-2 px-4`}
          onClick={() => handleTransaction({ type: id, amount: 101, success })}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
