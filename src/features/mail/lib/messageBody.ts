import type {
  JmapBodyPart,
  JmapBodyValue,
  JmapEmail,
} from "@/features/mail/types";

export interface ResolvedMessageBody {
  content: string;
  isHtml: boolean;
}

function collectParts(
  parts: JmapBodyPart[] | undefined,
  mimeType: string,
  result: JmapBodyPart[] = [],
): JmapBodyPart[] {
  for (const part of parts ?? []) {
    if (part.type.toLowerCase() === mimeType) result.push(part);
    collectParts(part.subParts, mimeType, result);
  }
  return result;
}

function contentForParts(
  parts: JmapBodyPart[],
  bodyValues: Record<string, JmapBodyValue>,
): string {
  const seen = new Set<string>();
  return parts
    .filter(({ partId }) => {
      if (!partId || seen.has(partId)) return false;
      seen.add(partId);
      return true;
    })
    .map(({ partId }) => bodyValues[partId]?.value ?? "")
    .filter(Boolean)
    .join("\n\n");
}

export function resolveMessageBody(email: JmapEmail): ResolvedMessageBody {
  const structure = email.bodyStructure ? [email.bodyStructure] : [];
  const html = contentForParts(
    [
      ...collectParts(email.htmlBody, "text/html"),
      ...collectParts(structure, "text/html"),
    ],
    email.bodyValues,
  );
  if (html) return { content: html, isHtml: true };

  const text = contentForParts(
    [
      ...collectParts(email.textBody, "text/plain"),
      ...collectParts(structure, "text/plain"),
    ],
    email.bodyValues,
  );
  return { content: text || email.preview || "", isHtml: false };
}

export function safeHtmlDocument(html: string): string {
  return `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">${html}`;
}
