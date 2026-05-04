import { NextRequest } from "next/server";
import { createChatStream, type GeminiMessage } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return new Response("GEMINI_API_KEY가 설정되지 않았어요.", { status: 500 });
  }

  let messages: GeminiMessage[];
  try {
    const body = await req.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("messages 배열이 필요해요.", { status: 400 });
    }
  } catch {
    return new Response("요청 형식이 올바르지 않아요.", { status: 400 });
  }

  try {
    const result = await createChatStream(messages);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[/api/chat] Gemini error:", err);
    return new Response("AI 응답 생성 중 오류가 발생했어요. 다시 시도해줘!", {
      status: 502,
    });
  }
}
