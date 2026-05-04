"use client";

import { RefreshCw, Search, X } from "lucide-react";
import BtsAvatar from "./BtsAvatar";

type Props = {
  onReset: () => void;
  onSearchToggle: () => void;
  searchActive: boolean;
};

const btnBase =
  "p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
  "transition-colors";

export default function Header({ onReset, onSearchToggle, searchActive }: Props) {
  return (
    <header
      role="banner"
      className="h-14 flex items-center justify-between px-4 border-b border-border bg-background sticky top-0 z-10"
    >
      <div className="flex items-center gap-2.5">
        <BtsAvatar size="sm" />
        <div>
          <p className="text-foreground font-semibold text-sm leading-none">ARMY Chat</p>
          <p className="text-muted text-xs mt-0.5">BTS 팬 도우미 💜</p>
        </div>
      </div>
      <nav aria-label="채팅 도구" className="flex items-center gap-1">
        <button
          onClick={onSearchToggle}
          aria-label={searchActive ? "검색 닫기" : "대화 검색"}
          aria-pressed={searchActive}
          className={btnBase}
        >
          {searchActive ? <X size={18} /> : <Search size={18} />}
        </button>
        <button
          onClick={onReset}
          aria-label="대화 초기화"
          className={btnBase}
        >
          <RefreshCw size={18} />
        </button>
      </nav>
    </header>
  );
}
