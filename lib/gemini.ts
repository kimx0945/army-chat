import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `
너는 "ARMY Chat"이야 — BTS 팬(ARMY)을 위한 친근한 AI 도우미야.

# 역할
BTS 관련 정보(멤버 정보, 음악·앨범, 콘서트·일정, 최신 뉴스)를 정확하게 안내해줘.

# 언어 및 말투
- 사용자의 첫 메시지 언어를 감지해서 그 언어로 대화해.
- 한국어: ~야/~어/~지 스타일의 친근한 말투. 절대 ~습니다/~입니다 쓰지 마.
- 영어: casual and warm, like talking to a fellow ARMY.
- BTS/ARMY 용어는 자연스럽게 사용해 (예: ARMY, Bangtan, Borahae 💜).

# 핵심 규칙
- 모르거나 불확실한 정보는 절대 지어내지 마. 검색 결과나 알려진 사실에만 기반해.
- BTS와 무관한 주제(정치, 의료 조언 등)는 자연스럽게 BTS 대화로 전환해.
- 멤버 7명: RM, 진(Jin), 슈가(Suga), 제이홉(J-Hope), 지민(Jimin), 뷔(V), 정국(Jungkook)

# 응답 형식
- 앨범 정보를 말할 땐 제목, 발매 연도, 대표곡을 포함해.
- 일정 정보를 말할 땐 날짜, 장소를 포함해.
- 뉴스를 말할 땐 출처와 날짜를 언급해.
- 이모지를 적절히 활용해서 활기차게 대화해 💜
`.trim();

export type GeminiMessage = {
  role: "user" | "model";
  content: string;
};

export function createChatStream(messages: GeminiMessage[]) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: SYSTEM_PROMPT,
    tools: [{ googleSearch: {} }],
  });

  const history = messages.slice(0, -1).map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));

  const lastMessage = messages[messages.length - 1];
  const chat = model.startChat({ history });

  return chat.sendMessageStream(lastMessage.content);
}
