import { ArrowLeft } from "@/src/components/icons/arrow-left";
import { Notifications } from "@/src/components/icons/notifications";
import Image from "next/image";

export default function Home() {
  return (
    <main>
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

        <div className="w-full flex flex-col items-center text-center">
          <div>
            <Image
              src="/qr-code.png"
              alt="Escanear QR code de pagamento"
              title="QR Code de pagamento"
              width={208}
              height={208}
              className="max-w-52 w-full h-auto"
            />
          </div>

          <div className="my-3 mx-auto">
            <h2>Scan to make payment</h2>
            <div className="text-4xl font-medium">R$ 101</div>
          </div>

          <div className="flex flex-col">
            <button>Simulate payment through PIX</button>
            <button>Simulate payment through Stripe</button>
          </div>
        </div>
      </div>
    </main>
  );
}
