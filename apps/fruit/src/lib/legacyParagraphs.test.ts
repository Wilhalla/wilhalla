import { describe, expect, it } from "vitest";
import { paragraphizeLegacyHtml } from "./legacyParagraphs";

const long = (word: string) => `${word} ${"en nog wat tekst ".repeat(5).trim()}.`;

describe("paragraphizeLegacyHtml", () => {
  it("turns <br>-separated prose into paragraphs and unwraps bare divs", () => {
    const html = `<div>${long("Eerste")}<br>${long("Tweede")}<br></div>`;
    expect(paragraphizeLegacyHtml(html)).toBe(`<p>${long("Eerste")}</p>\n<p>${long("Tweede")}</p>`);
  });

  it("keeps a single <br> between short lines such as captions", () => {
    expect(paragraphizeLegacyHtml("Foto 1: links<br>Foto 2: rechts")).toBe(
      "<p>Foto 1: links<br>Foto 2: rechts</p>",
    );
  });

  it("splits short lines on a blank line", () => {
    expect(paragraphizeLegacyHtml("<div>SNEEUWKLOKJES<br></div>Kort.<br><br>Ook kort.")).toBe(
      "<p>SNEEUWKLOKJES</p>\n<p>Kort.</p>\n<p>Ook kort.</p>",
    );
  });

  it("splits existing paragraphs that contain prose line breaks, keeping inline markup", () => {
    const html = `<p><b>Titel</b><br>${long("Tekst")}</p>`;
    expect(paragraphizeLegacyHtml(html)).toBe(`<p><b>Titel</b></p>\n<p>${long("Tekst")}</p>`);
  });

  it("gives images their own paragraph and leaves tables and lists alone", () => {
    const html =
      'Tekst<br><br><img src="a.jpg"><ul><li>a<br>b</li></ul><table><tr><td>x<br>y</td></tr></table>';
    expect(paragraphizeLegacyHtml(html)).toBe(
      '<p>Tekst</p>\n<p><img src="a.jpg"></p>\n<ul><li>a<br>b</li></ul>\n<table><tbody><tr><td>x<br>y</td></tr></tbody></table>',
    );
  });

  it("moves a linked photo out of the text it was placed in", () => {
    expect(paragraphizeLegacyHtml('<a href="a.jpg"><img src="a.jpg"></a> Tekst.')).toBe(
      '<p><a href="a.jpg"><img src="a.jpg"></a></p>\n<p>Tekst.</p>',
    );
  });

  it("drops empty paragraphs", () => {
    expect(paragraphizeLegacyHtml("<p>&nbsp;</p><p>Body</p><div><br></div>")).toBe("<p>Body</p>");
  });
});
