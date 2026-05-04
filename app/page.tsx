"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import ChatWindow, { type Message } from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const sendMessage = useCallback(
    async (text: string) => {
      if (isLoading) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
      };
      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "model",
        content: "",
        isStreaming: true,
      };

      const history = [...messages, userMsg];
      setMessages([...history, botMsg]);
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error(await res.text());
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          const snapshot = accumulated;
          setMessages((prev) =>
            prev.map((m) => (m.id === botMsg.id ? { ...m, content: snapshot } : m))
          );
        }

        setMessages((prev) =>
          prev.map((m) => (m.id === botMsg.id ? { ...m, isStreaming: false } : m))
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsg.id
              ? {
                  ...m,
                  content: "응답을 가져오는 중 오류가 발생했어. 다시 시도해줘! 😢",
                  isStreaming: false,
                }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setSearchActive(false);
    setSearchKeyword("");
  }, []);

  const toggleSearch = useCallback(() => {
    setSearchActive((prev) => {
      if (prev) setSearchKeyword("");
      return !prev;
    });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <Header
        onReset={reset}
        onSearchToggle={toggleSearch}
        searchActive={searchActive}
      />

      {searchActive && (
        <div role="search" className="px-4 py-2 border-b border-border bg-background">
          <input
            type="search"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && toggleSearch()}
            placeholder="대화 내 검색..."
            aria-label="대화 내 검색"
            autoFocus
            className="w-full max-w-3xl mx-auto block bg-surface text-foreground text-sm px-3 py-2 rounded-lg border border-border focus:border-primary focus-visible:outline-none outline-none placeholder:text-muted transition-colors"
          />
        </div>
      )}

      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        searchKeyword={searchKeyword}
        onSelectQuestion={sendMessage}
      />

      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
