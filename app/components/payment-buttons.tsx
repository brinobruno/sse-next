"use client";

const paymentButtons = [
  {
    id: "pix",
    label: "Pix",
    bg: "bg-green-200",
  },
  {
    id: "stripe",
    label: "Stripe",
    bg: "bg-blue-200",
    action: () => console.log("b"),
  },
];

type transaction = {
  type: string;
  amount: number;
};

async function handleTransaction({ type, amount }: transaction) {
  const eventSource = new EventSource(
    `http://localhost:3000/payment?type=${type}&amount=${amount}`
  );

  eventSource.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console.log(data);

    if (data.status === "paid") {
      eventSource.close();
      console.log("Payment successful!");
    }
  };
}

export function PaymentButtons() {
  return (
    <div className="flex flex-col gap-3">
      {paymentButtons.map(({ id, label, bg }) => (
        <button
          key={id}
          className={`${bg} text-background rounded-full font-medium py-2 px-4`}
          onClick={() => handleTransaction({ type: id, amount: 101 })}
        >
          Simulate payment with {label}
        </button>
      ))}
    </div>
  );
}
