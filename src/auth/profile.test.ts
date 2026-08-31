import { describe, expect, it } from "vitest";
import { getAuthenticatedUserProfile } from "./profile";

describe("getAuthenticatedUserProfile", () => {
  it("maps the authenticated user's profile without default admin values", () => {
    const profile = getAuthenticatedUserProfile({
      name: "Ada Lovelace",
      email: "ada@example.com",
    });

    expect(profile).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      initials: "AL",
    });
    expect(profile?.name).not.toBe("Admin User");
    expect(profile?.email).not.toBe("admin@omnixys.com");
  });

  it("does not create placeholder user data while authentication is unavailable", () => {
    expect(getAuthenticatedUserProfile(null)).toBeNull();
  });
});
