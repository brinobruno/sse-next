import Image from "next/image";

import { TransactionControl } from "@/app/components/transaction-control";
import { ArrowLeft } from "@/app/components/icons/arrow-left";
import { Notifications } from "@/app/components/icons/notifications";

export function Checkout() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <header className="flex justify-between items-center gap-2 py-6">
        <div className="cursor-pointer">
          <ArrowLeft />
        </div>

        <h1 className="text-lg font-medium">Checkout</h1>

        <div className="cursor-pointer">
          <Notifications />
        </div>
      </header>

      <div
        className="w-full flex flex-col items-center justify-center
        text-center my-8"
      >
        <div className="mb-4">
          <Image
            src="/qr-code.png"
            alt="Scan payment QR Code"
            title="Payment QR Code"
            width={208}
            height={208}
            className="max-w-52 w-full h-auto"
          />
        </div>

        <div className="mb-8 mx-auto">
          <h2 className="text-gray-300">Scan to make payment</h2>
          <div className="text-4xl font-medium">R$ 101</div>
        </div>

        <TransactionControl />
      </div>
    </div>
  );
}
