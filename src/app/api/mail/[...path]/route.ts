import { type NextRequest, NextResponse } from "next/server";
import {
  ensureMailAccount,
  getMailboxes,
  getMessages,
  MailApiError,
  mailAccessToken,
  markMessageRead,
  type SendMailInput,
  sendMessage,
} from "@/lib/mail/stalwart.server";

const _MAIL_SEND_ROLES = ["ADMIN", "SUPREME", "ELITE", "BASIC", "USER"];

async function context() {
  const accessToken = await mailAccessToken();
  return {
    accountId: await ensureMailAccount(accessToken),
  };
}

function failure(error: unknown) {
  const status = error instanceof MailApiError ? error.status : 500;
  const message =
    error instanceof Error ? error.message : "Mail request failed";
  console.error("[Mail API]", { status, message });
  return NextResponse.json({ error: message }, { status });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { accountId } = await context();
    const path = (await params).path.join("/");
    if (path === "mailboxes") {
      const mailboxes = await getMailboxes(accountId);
      return NextResponse.json(mailboxes);
    }
    if (path === "messages") {
      const mailboxId = request.nextUrl.searchParams.get("mailboxId");
      if (!mailboxId) throw new MailApiError(422, "mailboxId is required");
      const messages = await getMessages(accountId, mailboxId);
      return NextResponse.json(messages);
    }
    throw new MailApiError(404, "Mail operation not found");
  } catch (error) {
    return failure(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { accountId } = await context();
    const parts = (await params).path;
    if (parts[0] !== "messages" || !parts[1])
      throw new MailApiError(404, "Mail operation not found");
    const body = (await request.json()) as { read?: boolean };
    if (typeof body.read !== "boolean")
      throw new MailApiError(422, "read must be boolean");
    await markMessageRead(accountId, parts[1], body.read);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { accountId } = await context();
    const path = (await params).path.join("/");
    if (path !== "send")
      throw new MailApiError(404, "Mail operation not found");
    const body = (await request.json()) as SendMailInput;
    return NextResponse.json(await sendMessage(accountId, body), {
      status: 201,
    });
  } catch (error) {
    return failure(error);
  }
}
