import { Calendar, MapPin, ExternalLink } from "lucide-react";

type Props = {
  event: string;
  date: string;
  venue: string;
  ticketUrl?: string;
};

export default function ScheduleCard({ event, date, venue, ticketUrl }: Props) {
  return (
    <div className="mt-2 p-3 bg-background rounded-xl border border-border">
      <div className="flex items-start justify-between gap-2">
        <p className="text-foreground text-sm font-semibold leading-snug">{event}</p>
        {ticketUrl && (
          <a
            href={ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline shrink-0 flex items-center gap-0.5 transition-colors"
          >
            티켓 <ExternalLink size={11} />
          </a>
        )}
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-muted text-xs">
          <Calendar size={12} className="shrink-0" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted text-xs">
          <MapPin size={12} className="shrink-0" />
          <span>{venue}</span>
        </div>
      </div>
    </div>
  );
}
