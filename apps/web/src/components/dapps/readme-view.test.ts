import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ReadmeView } from "./readme-view";

const render = (markdown: string) =>
  renderToStaticMarkup(
    createElement(ReadmeView, {
      markdown,
      owner: "kit",
      repo: "swap",
      url: "https://github.com/kit/swap",
    }),
  );

describe("ReadmeView", () => {
  it("renders markdown and GitHub-style inline HTML", () => {
    const html = render('<p align="center"><b>Kit Swap</b></p>\n\n## Install\n\n- one\n- two');
    expect(html).toContain('<p align="center"><b>Kit Swap</b></p>');
    expect(html).toContain("<h2>Install</h2>");
    expect(html).toContain("<li>one</li>");
  });

  it("strips scripts, handlers, styles and frames", () => {
    const html = render(
      [
        "<script>alert(1)</script>",
        '<img src="x.png" onerror="alert(1)">',
        '<p style="position:fixed" onclick="alert(1)">hi</p>',
        '<iframe src="https://evil.example"></iframe>',
        '<form action="https://evil.example"><input name="seed"></form>',
      ].join("\n"),
    );
    expect(html).not.toMatch(/<script|onerror|onclick|style=|<iframe|<form/i);
  });

  it("never emits unsafe urls, in markdown or in HTML", () => {
    const html = render(
      [
        "[a](javascript:alert(1))",
        '<a href="javascript:alert(1)">b</a>',
        '<a href="data:text/html,<script>alert(1)</script>">c</a>',
        "![d](http://insecure.example/x.png)",
      ].join("\n\n"),
    );
    expect(html).not.toMatch(/javascript:|data:text|http:\/\//i);
  });

  it("resolves relative links and images into the repo, opening in a new tab", () => {
    const html = render("[docs](docs/setup.md)\n\n![logo](assets/logo.png)");
    expect(html).toContain('href="https://github.com/kit/swap/blob/HEAD/docs/setup.md"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('src="https://raw.githubusercontent.com/kit/swap/HEAD/assets/logo.png"');
  });
});
