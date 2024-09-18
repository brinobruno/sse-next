import { NextApiRequest, NextApiResponse } from "next";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { searchParams } = new URL(req.url as string);
  const type = searchParams.get("type");
  const amount = parseFloat(searchParams.get("amount") || "0");

  if (!type || amount < 0) return console.log("invalid transaction");

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();
  let closed = false;

  const sendStatus = (status: string) => {
    writer.write(
      encoder.encode(`data: ${JSON.stringify({ status, type, amount })}\n\n`)
    );
  };

  // Payment gateway simulation
  const processTransaction = async () => {
    sendStatus("pending");

    setTimeout(() => {
      if (!closed) {
        sendStatus("in_transit");
      }
    }, 3000);

    setTimeout(() => {
      if (!closed) {
        sendStatus("paid");

        // Close the stream and mark closed to prevent further writes
        writer.close();
        closed = true;
      }
    }, 6000);
  };

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
