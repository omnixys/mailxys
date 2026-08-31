export type LoginField = "username" | "password";

export type LoginValidationResult =
  | { success: true; data: { username: string; password: string } }
  | { success: false; fields: Partial<Record<LoginField, "required">> };

export function validateLoginInput(input: unknown): LoginValidationResult {
  if (!input || typeof input !== "object") {
    return {
      success: false,
      fields: { username: "required", password: "required" },
    };
  }

  const candidate = input as Record<string, unknown>;
  const username =
    typeof candidate.username === "string" ? candidate.username.trim() : "";
  const password =
    typeof candidate.password === "string" ? candidate.password : "";
  const fields: Partial<Record<LoginField, "required">> = {};

  if (!username) fields.username = "required";
  if (!password) fields.password = "required";

  if (Object.keys(fields).length > 0) {
    return { success: false, fields };
  }

  return { success: true, data: { username, password } };
}

export function gatewayLoginFailure(status: number): {
  status: 401 | 502;
  message: string;
} {
  if (status === 401 || status === 403) {
    return { status: 401, message: "Authentication failed" };
  }
  return { status: 502, message: "Authentication service is unavailable" };
}
