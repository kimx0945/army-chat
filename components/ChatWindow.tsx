"use client";

import { useEffect, useRef } from "react";
import BtsAvatar from "./BtsAvatar";
import MessageBubble from "./MessageBubble";
import WelcomeScreen from "./WelcomeScreen";

export type Message = {
  id: string;
  role: "user" | "model";
  content: string;
  isStreaming?: boolean;
};

type Props = {
  messages: Message[];
  isLoading: boolean;
  searchKeyword?: string;
  onSelectQuestion: (text: string) => void;
};

export default function ChatWindow({
  messages,
  isLoading,
  searchKeyword,
  onSelectQuestion,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // 새 메시지가 추가될 때 하단으로 스크롤 (검색 중에는 하지 않음)
  useEffect(() => {
    if (!searchKeyword?.trim()) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, searchKeyword]);

  // 검색어 변경 시 첫 번째 일치 메시지로 스크롤
  useEffect(() => {
    if (!searchKeyword?.trim()) return;
    const firstMatch = messages.find((m) =>
      m.content.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    if (firstMatch) {
      messageRefs.current
        .get(firstMatch.id)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [searchKeyword, messages]);

  if (messages.length === 0) {
    return <WelcomeScreen onSelectQuestion={onSelectQuestion} />;
  }

  const showTyping = isLoading && !messages.some((m) => m.isStreaming);

  return (
    <div
      role="log"
      aria-label="대화 내용"
      aria-live="polite"
      aria-relevant="additions"
      className="flex-1 overflow-y-auto px-4 py-6"
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            ref={(el) => {
              if (el) messageRefs.current.set(msg.id, el);
              else messageRefs.current.delete(msg.id);
            }}
          >
            <MessageBubble
              role={msg.role}
              content={msg.content}
              isStreaming={msg.isStreaming}
              searchKeyword={searchKeyword}
            />
          </div>
        ))}
        {showTyping && <TypingIndicator />}
        <div ref={bottomRef} aria-hidden="true" />
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-start" role="status" aria-label="ARMY Chat이 답변을 생성하고 있어요">
      <BtsAvatar size="sm" />
      <div className="px-4 py-3 bg-surface rounded-2xl rounded-tl-sm border-l-2 border-primary">
        <div className="flex gap-1.5 items-center h-4" aria-hidden="true">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="w-1.5 h-1.5 bg-primary rounded-full"
              style={{ animation: `bounce-dot 0.8s ease-in-out ${delay}ms infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
