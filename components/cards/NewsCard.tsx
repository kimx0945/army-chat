import { Newspaper, ExternalLink } from "lucide-react";

type Props = {
  headline: string;
  source: string;
  date: string;
  url?: string;
};

export default function NewsCard({ headline, source, date, url }: Props) {
  return (
    <div className="mt-2 p-3 bg-background rounded-xl border border-border">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <Newspaper size={14} className="text-primary mt-0.5 shrink-0" />
          <p className="text-foreground text-sm font-medium leading-snug">{headline}</p>
        </div>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-primary hover:text-foreground shrink-0 transition-colors"
            aria-label="기사 보기"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
      <p className="text-muted text-xs mt-1.5 ml-5">
        {source} · {date}
      </p>
    </div>
  );
}
