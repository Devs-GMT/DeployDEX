import { describe, expect, it } from "vitest";
import { resolveReadmeUrl } from "./readme";

const href = (v: string) => resolveReadmeUrl(v, "href", "kit", "swap");
const src = (v: string) => resolveReadmeUrl(v, "src", "kit", "swap");

describe("resolveReadmeUrl", () => {
  it("keeps absolute https urls", () => {
    expect(href("https://example.com/docs")).toBe("https://example.com/docs");
    expect(src("https://img.shields.io/badge/x-y-orange")).toBe(
      "https://img.shields.io/badge/x-y-orange",
    );
  });

  it("drops dangerous and non-https schemes", () => {
    expect(href("javascript:alert(1)")).toBeNull();
    expect(href("JavaScript:alert(1)")).toBeNull();
    expect(src("data:image/svg+xml;base64,PHN2Zz4=")).toBeNull();
    expect(href("http://example.com")).toBeNull();
    expect(href("vbscript:msgbox(1)")).toBeNull();
  });

  it("drops credentials, anchors and protocol-relative urls", () => {
    expect(href("https://user:pass@example.com")).toBeNull();
    expect(href("#install")).toBeNull();
    expect(src("//evil.example/pixel.png")).toBeNull();
    expect(href("")).toBeNull();
  });

  it("resolves relative links to the repo file view", () => {
    expect(href("docs/setup.md")).toBe("https://github.com/kit/swap/blob/HEAD/docs/setup.md");
    expect(href("./LICENSE")).toBe("https://github.com/kit/swap/blob/HEAD/LICENSE");
    expect(href("/CONTRIBUTING.md")).toBe("https://github.com/kit/swap/blob/HEAD/CONTRIBUTING.md");
  });

  it("resolves relative images to raw files", () => {
    expect(src("assets/logo.png")).toBe(
      "https://raw.githubusercontent.com/kit/swap/HEAD/assets/logo.png",
    );
    expect(src("./shot.gif")).toBe("https://raw.githubusercontent.com/kit/swap/HEAD/shot.gif");
  });
});
