import { type NextRequest, NextResponse } from "next/server";
import {
  ensureMailAccount,
  getMailboxes,
  getMessage,
  getMessages,
  MailApiError,
  mailAccessToken,
  markMessageRead,
  type SendMailInput,
  sendMessage,
} from "@/lib/mail/stalwart.server";

async function context(requestId: string) {
  const accessToken = await mailAccessToken(requestId);
  return {
    accessToken,
    accountId: await ensureMailAccount(accessToken, requestId),
  };
}

function requestIdFor(request: NextRequest): string {
  const incoming = request.headers.get("x-request-id")?.trim();
  return incoming && incoming.length <= 128 ? incoming : crypto.randomUUID();
}

function failure(error: unknown, requestId: string) {
  const status = error instanceof MailApiError ? error.status : 500;
  const code = error instanceof MailApiError ? error.code : "INTERNAL_ERROR";
  const message =
    error instanceof MailApiError ? error.message : "Mail request failed";
  console.error("[Mail API]", { status, code, message, requestId });
  return NextResponse.json(
    { error: message, code, requestId },
    { status, headers: { "x-request-id": requestId } },
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const requestId = requestIdFor(request);
  try {
    const parts = (await params).path;
    if (parts.length === 1 && parts[0] === "mailboxes") {
      const { accessToken, accountId } = await context(requestId);
      const mailboxes = await getMailboxes(accessToken, accountId, requestId);
      return NextResponse.json(mailboxes);
    }
    if (parts.length === 1 && parts[0] === "messages") {
      const mailboxId = request.nextUrl.searchParams.get("mailboxId");
      if (!mailboxId) {
        throw new MailApiError(422, "INVALID_REQUEST", "mailboxId is required");
      }
      const { accessToken, accountId } = await context(requestId);
      const messages = await getMessages(
        accessToken,
        accountId,
        mailboxId,
        requestId,
      );
      return NextResponse.json(messages);
    }
    if (parts.length === 2 && parts[0] === "messages" && parts[1]) {
      const { accessToken, accountId } = await context(requestId);
      const message = await getMessage(
        accessToken,
        accountId,
        parts[1],
        requestId,
      );
      return NextResponse.json(message);
    }
    throw new MailApiError(
      404,
      "MAIL_OPERATION_NOT_FOUND",
      "Mail operation not found",
    );
  } catch (error) {
    return failure(error, requestId);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const requestId = requestIdFor(request);
  try {
    const parts = (await params).path;
    if (parts[0] !== "messages" || !parts[1]) {
      throw new MailApiError(
        404,
        "MAIL_OPERATION_NOT_FOUND",
        "Mail operation not found",
      );
    }
    const body = (await request.json().catch(() => null)) as {
      read?: boolean;
    } | null;
    if (!body || typeof body.read !== "boolean") {
      throw new MailApiError(422, "INVALID_REQUEST", "read must be boolean");
    }
    const { accessToken, accountId } = await context(requestId);
    await markMessageRead(
      accessToken,
      accountId,
      parts[1],
      body.read,
      requestId,
    );
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return failure(error, requestId);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const requestId = requestIdFor(request);
  try {
    const path = (await params).path.join("/");
    if (path !== "send") {
      throw new MailApiError(
        404,
        "MAIL_OPERATION_NOT_FOUND",
        "Mail operation not found",
      );
    }
    const body = (await request
      .json()
      .catch(() => null)) as SendMailInput | null;
    if (
      !body ||
      typeof body.to !== "string" ||
      typeof body.subject !== "string" ||
      typeof body.body !== "string"
    ) {
      throw new MailApiError(400, "INVALID_REQUEST", "Invalid mail request");
    }
    const { accessToken, accountId } = await context(requestId);
    const result = await sendMessage(accessToken, accountId, body, requestId);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return failure(error, requestId);
  }
}
