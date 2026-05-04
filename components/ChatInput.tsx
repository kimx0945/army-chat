"use client";

import { useRef } from "react";
import { Send } from "lucide-react";

type Props = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export default function ChatInput({ onSend, disabled }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function resize() {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  function submit() {
    const text = ref.current?.value.trim();
    if (!text || disabled) return;
    onSend(text);
    if (ref.current) {
      ref.current.value = "";
      ref.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div
      className="px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] border-t border-border bg-background"
    >
      <div
        role="form"
        aria-label="메시지 입력"
        className="flex items-end gap-2 max-w-3xl mx-auto bg-surface rounded-2xl px-4 py-2 border border-border focus-within:border-primary transition-colors"
      >
        <textarea
          ref={ref}
          id="chat-input"
          rows={1}
          onInput={resize}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="BTS에 대해 뭐든 물어봐! 💜"
          aria-label="메시지 입력란"
          aria-multiline="true"
          aria-disabled={disabled}
          className="flex-1 bg-transparent text-foreground text-sm resize-none outline-none placeholder:text-muted py-1.5 max-h-32 disabled:opacity-50"
        />
        <button
          onClick={submit}
          disabled={disabled}
          aria-label="메시지 전송"
          className="p-1.5 mb-0.5 rounded-xl bg-primary text-white hover:bg-primary-hover disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface transition-colors shrink-0"
        >
          <Send size={16} aria-hidden="true" />
        </button>
      </div>
      <p className="text-center text-muted text-xs mt-2 hidden sm:block" aria-hidden="true">
        Enter로 전송 · Shift+Enter로 줄바꿈
      </p>
    </div>
  );
}
