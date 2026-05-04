import BtsAvatar from "./BtsAvatar";
import AlbumCard from "./cards/AlbumCard";
import NewsCard from "./cards/NewsCard";
import ScheduleCard from "./cards/ScheduleCard";
import { parseMessage, stripCardLines, type Segment } from "@/lib/parseCards";

type Props = {
  role: "user" | "model";
  content: string;
  isStreaming?: boolean;
  searchKeyword?: string;
};

export default function MessageBubble({ role, content, isStreaming, searchKeyword }: Props) {
  if (role === "user") {
    return (
      <div className="flex justify-end" role="article" aria-label="내 메시지">
        <div className="max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-primary text-white text-sm leading-relaxed">
          <HighlightedText text={content} keyword={searchKeyword} />
        </div>
      </div>
    );
  }

  // 스트리밍 중: 카드 마커 줄 숨김, 텍스트만 표시
  if (isStreaming) {
    const displayText = stripCardLines(content);
    return (
      <div className="flex gap-3 items-start" role="article" aria-label="ARMY Chat 답변">
        <BtsAvatar size="sm" />
        <div className="max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl rounded-tl-sm bg-surface border-l-2 border-primary text-foreground text-sm leading-relaxed">
          <HighlightedText text={displayText} keyword={searchKeyword} />
          <span
            aria-hidden="true"
            className="inline-block w-0.5 h-4 ml-0.5 bg-primary align-middle"
            style={{ animation: "blink 1s ease-in-out infinite" }}
          />
        </div>
      </div>
    );
  }

  // 스트리밍 완료: 파싱 후 카드 인라인 렌더링
  const segments = parseMessage(content);

  return (
    <div className="flex gap-3 items-start" role="article" aria-label="ARMY Chat 답변">
      <BtsAvatar size="sm" />
      <div className="max-w-[80%] sm:max-w-[70%]">
        {segments.map((seg, i) => (
          <SegmentView key={i} segment={seg} searchKeyword={searchKeyword} />
        ))}
      </div>
    </div>
  );
}

function SegmentView({ segment, searchKeyword }: { segment: Segment; searchKeyword?: string }) {
  if (segment.type === "text") {
    return (
      <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-surface border-l-2 border-primary text-foreground text-sm leading-relaxed">
        <HighlightedText text={segment.content} keyword={searchKeyword} />
      </div>
    );
  }
  if (segment.type === "album") {
    return <AlbumCard title={segment.title} year={segment.year} tracks={segment.tracks} link={segment.link} />;
  }
  if (segment.type === "schedule") {
    return <ScheduleCard event={segment.event} date={segment.date} venue={segment.venue} ticketUrl={segment.ticketUrl} />;
  }
  if (segment.type === "news") {
    return <NewsCard headline={segment.headline} source={segment.source} date={segment.date} url={segment.url} />;
  }
  return null;
}

function HighlightedText({ text, keyword }: { text: string; keyword?: string }) {
  if (!keyword?.trim()) {
    return <span style={{ whiteSpace: "pre-wrap" }}>{text}</span>;
  }

  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));

  return (
    <span style={{ whiteSpace: "pre-wrap" }}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="bg-yellow-400 text-black rounded px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}
