export const runtime = "edge";

export async function POST(request) {
  const body = await request.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "API key no configurada en Vercel." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") || "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
