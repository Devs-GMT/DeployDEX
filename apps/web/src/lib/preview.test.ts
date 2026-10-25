import { describe, expect, it } from "vitest";
import { extractPreviewImage, isPrivateAddress } from "./preview";

describe("extractPreviewImage", () => {
  const page = "https://app.example.com/dashboard/";

  it("reads og:image in either attribute order", () => {
    expect(
      extractPreviewImage(
        '<meta property="og:image" content="https://cdn.example.com/a.png">',
        page,
      ),
    ).toBe("https://cdn.example.com/a.png");
    expect(
      extractPreviewImage(
        "<meta content='https://cdn.example.com/b.png' property='og:image' />",
        page,
      ),
    ).toBe("https://cdn.example.com/b.png");
  });

  it("resolves relative paths and decodes entities", () => {
    expect(
      extractPreviewImage('<meta property="og:image" content="/og.png?a=1&amp;b=2">', page),
    ).toBe("https://app.example.com/og.png?a=1&b=2");
  });

  it("prefers og:image over twitter:image", () => {
    const html =
      '<meta name="twitter:image" content="https://x.example.com/t.png"><meta property="og:image" content="https://x.example.com/o.png">';
    expect(extractPreviewImage(html, page)).toBe("https://x.example.com/o.png");
  });

  it("falls back to twitter:image", () => {
    expect(
      extractPreviewImage(
        '<meta name="twitter:image" content="https://x.example.com/t.png">',
        page,
      ),
    ).toBe("https://x.example.com/t.png");
  });

  it("rejects non-https images and pages without one", () => {
    expect(
      extractPreviewImage('<meta property="og:image" content="http://x.example.com/a.png">', page),
    ).toBeNull();
    expect(
      extractPreviewImage('<meta property="og:image" content="javascript:alert(1)">', page),
    ).toBeNull();
    expect(extractPreviewImage("<title>No image</title>", page)).toBeNull();
  });
});

describe("isPrivateAddress", () => {
  it.each([
    "127.0.0.1",
    "10.1.2.3",
    "172.20.0.1",
    "192.168.1.1",
    "169.254.169.254",
    "100.64.0.1",
    "0.0.0.0",
    "::1",
    "fd00::1",
    "fe80::1",
    "::ffff:127.0.0.1",
  ])("blocks %s", (ip) => expect(isPrivateAddress(ip)).toBe(true));

  it.each(["8.8.8.8", "104.16.0.1", "2606:4700::1111", "::ffff:8.8.8.8"])("allows %s", (ip) => {
    expect(isPrivateAddress(ip)).toBe(false);
  });
});
