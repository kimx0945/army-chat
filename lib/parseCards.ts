export type Segment =
  | { type: "text"; content: string }
  | { type: "album"; title: string; year: string; tracks?: string[]; link?: string }
  | { type: "schedule"; event: string; date: string; venue: string; ticketUrl?: string }
  | { type: "news"; headline: string; source: string; date: string; url?: string };

const PREFIXES = ["CARD_ALBUM:", "CARD_SCHEDULE:", "CARD_NEWS:"] as const;

function isCardLine(line: string) {
  return PREFIXES.some((p) => line.startsWith(p));
}

export function parseMessage(content: string): Segment[] {
  const lines = content.split("\n");
  const segments: Segment[] = [];
  let textBuffer = "";

  const flushText = () => {
    const trimmed = textBuffer.trimEnd();
    if (trimmed) segments.push({ type: "text", content: trimmed });
    textBuffer = "";
  };

  for (const line of lines) {
    if (line.startsWith("CARD_ALBUM:")) {
      flushText();
      try {
        const data = JSON.parse(line.slice("CARD_ALBUM:".length));
        segments.push({ type: "album", ...data });
      } catch {
        textBuffer += line + "\n";
      }
    } else if (line.startsWith("CARD_SCHEDULE:")) {
      flushText();
      try {
        const data = JSON.parse(line.slice("CARD_SCHEDULE:".length));
        segments.push({ type: "schedule", ...data });
      } catch {
        textBuffer += line + "\n";
      }
    } else if (line.startsWith("CARD_NEWS:")) {
      flushText();
      try {
        const data = JSON.parse(line.slice("CARD_NEWS:".length));
        segments.push({ type: "news", ...data });
      } catch {
        textBuffer += line + "\n";
      }
    } else {
      textBuffer += line + "\n";
    }
  }

  flushText();
  return segments;
}

export function stripCardLines(content: string): string {
  return content
    .split("\n")
    .filter((line) => !isCardLine(line))
    .join("\n");
}
