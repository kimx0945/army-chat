import BtsAvatar from "./BtsAvatar";

const QUICK_QUESTIONS = [
  { emoji: "🙋", label: "멤버 소개", text: "BTS 멤버들을 소개해줘!" },
  { emoji: "🎵", label: "최신 앨범", text: "BTS 최신 앨범이 뭐야?" },
  { emoji: "🎤", label: "다음 콘서트", text: "BTS 다음 콘서트 일정 알려줘!" },
  { emoji: "📰", label: "오늘의 뉴스", text: "BTS 최신 뉴스 알려줘!" },
];

type Props = {
  onSelectQuestion: (text: string) => void;
};

export default function WelcomeScreen({ onSelectQuestion }: Props) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-12 text-center">
      <BtsAvatar size="lg" />
      <h1 className="mt-5 text-2xl font-bold text-foreground">
        ARMY Chat에 온 걸 환영해! 💜
      </h1>
      <p className="mt-2 text-muted text-sm max-w-xs leading-relaxed">
        BTS 멤버 정보, 음악, 콘서트 일정, 최신 뉴스까지 뭐든 물어봐!
      </p>
      <div
        role="group"
        aria-label="빠른 질문 선택"
        className="mt-8 grid grid-cols-2 gap-3 w-full max-w-sm"
      >
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q.label}
            onClick={() => onSelectQuestion(q.text)}
            aria-label={q.text}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface border border-border hover:border-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all text-foreground"
          >
            <span className="text-2xl" aria-hidden="true">{q.emoji}</span>
            <span className="text-sm font-medium">{q.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
