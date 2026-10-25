import { describe, expect, it } from "vitest";
import { extractPreviewImage, isPrivateAddress, sniffImage } from "./preview";

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
    "64:ff9b::7f00:1",
    "64:ff9b::10.0.0.1",
    "64:ff9b:1::a9fe:a9fe",
  ])("blocks %s", (ip) => expect(isPrivateAddress(ip)).toBe(true));

  it.each([
    "8.8.8.8",
    "104.16.0.1",
    "2606:4700::1111",
    "::ffff:8.8.8.8",
    "64:ff9b::14cd:f3a6",
    "64:ff9b::8.8.8.8",
  ])("allows %s", (ip) => {
    expect(isPrivateAddress(ip)).toBe(false);
  });
});

describe("sniffImage", () => {
  const bytes = (...xs: (number | string)[]) =>
    new Uint8Array(
      xs.flatMap((x) => (typeof x === "string" ? [...x].map((c) => c.charCodeAt(0)) : [x])),
    );

  it("recognises raster formats by their magic bytes", () => {
    expect(sniffImage(bytes(0x89, "PNG", 13, 10))).toBe("image/png");
    expect(sniffImage(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe("image/jpeg");
    expect(sniffImage(bytes("GIF89a"))).toBe("image/gif");
    expect(sniffImage(bytes("RIFF", 0, 0, 0, 0, "WEBPVP8 "))).toBe("image/webp");
    expect(sniffImage(bytes(0, 0, 0, 0x1c, "ftypavif"))).toBe("image/avif");
  });

  it("recognises SVG, with or without an XML prolog", () => {
    expect(sniffImage(bytes('<svg xmlns="http://www.w3.org/2000/svg"></svg>'))).toBe(
      "image/svg+xml",
    );
    expect(sniffImage(bytes('<?xml version="1.0"?>', 10, '<svg viewBox="0 0 1 1"/>'))).toBe(
      "image/svg+xml",
    );
  });

  it("rejects HTML, scripts and other files", () => {
    expect(sniffImage(bytes("<!doctype html><html>"))).toBeNull();
    expect(sniffImage(bytes("<html><svg></svg></html>"))).toBeNull();
    expect(sniffImage(bytes("alert(1)"))).toBeNull();
    expect(sniffImage(bytes("PK", 3, 4))).toBeNull();
  });
});
