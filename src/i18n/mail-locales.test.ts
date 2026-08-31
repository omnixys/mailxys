import { describe, expect, it } from "vitest";
import de from "../../messages/de/mail.json";
import en from "../../messages/en/mail.json";

describe("mail translations", () => {
  it("keeps German and English keys in parity", () => {
    expect(Object.keys(de).sort()).toEqual(Object.keys(en).sort());
  });

  it.each(["selectAll", "writeBody", "send"] as const)(
    "provides a German value for %s",
    (key) => {
      expect(de[key].trim()).not.toBe("");
      expect(de[key]).not.toBe(en[key]);
    },
  );
});
