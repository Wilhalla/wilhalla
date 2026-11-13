import { describe, expect, it } from "vitest";
import { collectWordForms, sentenceCaseTitle } from "./titleCase";

const forms = collectWordForms([
  "Gisteren hielp Dorien bij de verkoop. Ook Dorien was er. De werkgroep van VELT kwam langs.",
  "Wij aten appels en peren. De peren waren rijp.",
  "VORMEN EN LIJNEN zag ik overal.",
]);

describe("sentenceCaseTitle", () => {
  it("sentence-cases an all-caps title and keeps names the archive capitalizes", () => {
    expect(sentenceCaseTitle("DANK U DORIEN", forms)).toBe("Dank u Dorien");
  });

  it("keeps acronyms the archive writes in capitals", () => {
    expect(sentenceCaseTitle("VELT EN PEREN", forms)).toBe("VELT en peren");
  });

  it("ignores shouted headings as evidence", () => {
    expect(sentenceCaseTitle("VORMEN EN LIJNEN", forms)).toBe("Vormen en lijnen");
  });

  it("leaves titles that are not all caps alone", () => {
    expect(sentenceCaseTitle("Kleur in mijn Tuin", forms)).toBe("Kleur in mijn Tuin");
    expect(sentenceCaseTitle("NBS", forms)).toBe("NBS");
  });
});
