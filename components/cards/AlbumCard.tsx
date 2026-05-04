import { Music, ExternalLink } from "lucide-react";

type Props = {
  title: string;
  year: string;
  tracks?: string[];
  link?: string;
};

export default function AlbumCard({ title, year, tracks, link }: Props) {
  return (
    <div className="mt-2 flex items-center gap-3 p-3 bg-background rounded-xl border border-border">
      <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center shrink-0">
        <Music size={20} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-foreground font-semibold text-sm truncate">{title}</p>
        <p className="text-muted text-xs">{year}</p>
        {tracks && tracks.length > 0 && (
          <p className="text-muted text-xs mt-0.5 truncate">
            수록곡: {tracks.join(", ")}
          </p>
        )}
      </div>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 text-primary hover:text-foreground shrink-0 transition-colors"
          aria-label="앨범 듣기"
        >
          <ExternalLink size={16} />
        </a>
      )}
    </div>
  );
}
