import { describe, expect, it } from "vitest";
import {
  byteLength,
  collectErrors,
  dappFormSchema,
  normalizeAddress,
  parseRepo,
  safeHttpsUrl,
  validateField,
} from "./validators";

describe("safeHttpsUrl", () => {
  it("accepts plain https urls", () => {
    expect(safeHttpsUrl("https://example.com/app")).toBe("https://example.com/app");
  });

  it.each([
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "http://example.com",
    "ftp://example.com",
    "https://user:pass@example.com",
    "//example.com",
    "not a url",
    "",
  ])("rejects %s", (value) => {
    expect(safeHttpsUrl(value)).toBeNull();
  });

  it("rejects missing values and over-long urls", () => {
    expect(safeHttpsUrl(undefined)).toBeNull();
    expect(safeHttpsUrl(null)).toBeNull();
    expect(safeHttpsUrl(`https://example.com/${"a".repeat(300)}`)).toBeNull();
  });
});

describe("parseRepo", () => {
  it("parses owner/repo and github urls", () => {
    expect(parseRepo("vercel/next.js")).toEqual({ owner: "vercel", repo: "next.js" });
    expect(parseRepo("https://github.com/vercel/next.js/")).toEqual({ owner: "vercel", repo: "next.js" });
    expect(parseRepo("https://www.github.com/a/b.git")).toEqual({ owner: "a", repo: "b" });
  });

  it("rejects junk and path traversal", () => {
    expect(parseRepo("nope")).toBeNull();
    expect(parseRepo("a/b/c")).toBeNull();
    expect(parseRepo("../etc/passwd")).toBeNull();
    expect(parseRepo("")).toBeNull();
  });
});

describe("dappFormSchema", () => {
  const valid = {
    name: "Kit Swap",
    tagline: "Swap with a cat",
    category: 3,
    target: "0x3b3ABC68c8Af9C769612f13E03EBfb9091Cb735A",
    liveUrl: "https://kit.example",
    repo: "owner/repo",
    logoUrl: "",
  };

  it("accepts a valid listing", () => {
    expect(dappFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects tagline over 80 chars, bad address, http url and bad category", () => {
    expect(dappFormSchema.safeParse({ ...valid, tagline: "x".repeat(81) }).success).toBe(false);
    expect(dappFormSchema.safeParse({ ...valid, target: "0x123" }).success).toBe(false);
    expect(dappFormSchema.safeParse({ ...valid, liveUrl: "http://kit.example" }).success).toBe(false);
    expect(dappFormSchema.safeParse({ ...valid, category: 9 }).success).toBe(false);
    expect(dappFormSchema.safeParse({ ...valid, name: "  " }).success).toBe(false);
  });

  it("rejects a non-https logo but allows an empty one", () => {
    expect(dappFormSchema.safeParse({ ...valid, logoUrl: "javascript:alert(1)" }).success).toBe(false);
    expect(dappFormSchema.safeParse({ ...valid, logoUrl: "https://kit.example/l.png" }).success).toBe(true);
  });
});

describe("byteLength", () => {
  it("counts utf-8 bytes, not characters", () => {
    expect(byteLength("kit")).toBe(3);
    expect(byteLength("🔥")).toBe(4);
    expect(byteLength("é")).toBe(2);
  });
});

describe("field validation", () => {
  it("matches the contract byte limits", () => {
    expect(validateField("tagline", "x".repeat(80))).toBeNull();
    expect(validateField("tagline", "x".repeat(81))).toMatch(/Max 80 bytes/);
    expect(validateField("tagline", "🔥".repeat(21))).toMatch(/Max 80 bytes/);
    expect(validateField("name", "  ")).toBe("Name is required");
    expect(validateField("target", "0x123")).toMatch(/valid 0x address/);
    expect(validateField("liveUrl", "http://kit.example")).toMatch(/https/);
  });

  it("collects one error per field in form order", () => {
    const errors = collectErrors({
      name: "",
      tagline: "ok",
      category: 0,
      target: "nope",
      liveUrl: "http://kit.example",
      repo: "nope",
      logoUrl: "",
    });
    expect(Object.keys(errors)).toEqual(["name", "target", "liveUrl", "repo"]);
  });
});

describe("normalizeAddress", () => {
  it("returns a checksummed address and leaves invalid input trimmed", () => {
    expect(normalizeAddress("0x3b3abc68c8af9c769612f13e03ebfb9091cb735a")).toBe(
      "0x3b3ABC68c8Af9C769612f13E03EBfb9091Cb735A",
    );
    expect(normalizeAddress(" 0x123 ")).toBe("0x123");
  });
});
