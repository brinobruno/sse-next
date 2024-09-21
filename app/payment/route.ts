import { NextRequest, NextResponse } from "next/server";

import { PAYMENT_STATUSES } from "../utils/payment-statuses";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url as string);
  const type = searchParams.get("type") || null;
  const amount = parseFloat(searchParams.get("amount") || "0");
  const success = searchParams.get("success") === "true";

  if (!type || amount < 0) {
    return new Response(JSON.stringify({ error: "invalid transaction" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();
  let closed = false;

  function sendStatus(status: string) {
    writer.write(
      encoder.encode(`data: ${JSON.stringify({ status, type, amount })}\n\n`)
    );
  }

  // Payment gateway simulation
  async function processTransaction() {
    sendStatus(PAYMENT_STATUSES.PENDING);

    function simulateSuccess() {
      setTimeout(() => {
        if (!closed) {
          sendStatus(PAYMENT_STATUSES.IN_TRANSIT);
        }
      }, 3000);

      setTimeout(() => {
        if (!closed) {
          sendStatus(PAYMENT_STATUSES.PAID);

          // Close the stream and mark closed to prevent further writes
          writer.close();
          closed = true;
        }
      }, 6000);
    }

    function simulateFailure() {
      setTimeout(() => {
        if (!closed) {
          sendStatus(PAYMENT_STATUSES.CANCELED);

          // Close the stream and mark closed to prevent further writes
          writer.close();
          closed = true;
        }
      }, 3000);
    }

    if (success === false) {
      simulateFailure();
      return;
    }

    simulateSuccess();
  }

  await processTransaction();

  // Return the SSE response
  return new Response(responseStream.readable, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Content-Encoding": "none",
    },
  });
}
