// About a third of the Seniorennet titles were typed in capitals ("DANK U DORIEN"). In the large
// serif they shout, so they are set in sentence case. Names survive by looking at how the archive
// itself writes each word: mostly capitalized in running text (Dorien, Puyenbroeck) keeps its
// capital, mostly in capitals (VELT, OKRA) stays in capitals, everything else is lowercase.

export type WordForms = Map<string, { lower: number; capital: number; upper: number }>;

const WORD = /[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu;

function isLower(word: string) {
  return word === word.toLocaleLowerCase("nl");
}

function isUpper(word: string) {
  return word.length > 1 && word === word.toLocaleUpperCase("nl") && /\p{Lu}/u.test(word);
}

export function isAllCapsTitle(value: string) {
  const letters = value.replace(/[^\p{L}]/gu, "");
  return letters.length >= 4 && isUpper(letters);
}

function capitalize(word: string) {
  // Dutch IJ is one letter: IJSSEL → IJssel, not Ijssel.
  if (/^ij/i.test(word)) return `IJ${word.slice(2)}`;
  return word.charAt(0).toLocaleUpperCase("nl") + word.slice(1);
}

/**
 * Counts how running text writes each word. Skipped as evidence: the first word of a sentence
 * (capitalized for grammar), words in a run of three or more capitalized words (a Title Case
 * heading) and words in a run of two or more all-caps words (a shouted heading).
 */
export function collectWordForms(texts: Iterable<string>, forms: WordForms = new Map()) {
  for (const text of texts) {
    for (const sentence of text.split(/(?<=[.!?:;])\s+|\n+/)) {
      const words = Array.from(sentence.matchAll(/\p{L}[\p{L}\p{N}'’-]*/gu), (match) => match[0]);
      words.forEach((word, index) => {
        if (index === 0) return;
        const capitalized = (w: string | undefined) => w !== undefined && !isLower(w);
        const upper = (w: string | undefined) => w !== undefined && isUpper(w);
        const key = word.toLocaleLowerCase("nl");
        const entry = forms.get(key) ?? { lower: 0, capital: 0, upper: 0 };
        if (isLower(word)) entry.lower += 1;
        else if (isUpper(word)) {
          if (upper(words[index - 1]) || upper(words[index + 1])) return;
          entry.upper += 1;
        } else {
          const run = [words[index - 2], words[index - 1], words[index + 1], words[index + 2]];
          const inHeading =
            (capitalized(run[1]) && capitalized(run[0])) ||
            (capitalized(run[1]) && capitalized(run[2])) ||
            (capitalized(run[2]) && capitalized(run[3]));
          if (inHeading) return;
          entry.capital += 1;
        }
        forms.set(key, entry);
      });
    }
  }
  return forms;
}

/** Sentence-cases an all-caps title; any other title is returned unchanged. */
export function sentenceCaseTitle(title: string, forms: WordForms) {
  if (!isAllCapsTitle(title)) return title;
  let first = true;
  return title.replace(WORD, (word) => {
    const lower = word.toLocaleLowerCase("nl");
    const form = forms.get(lower) ?? { lower: 0, capital: 0, upper: 0 };
    let result = lower;
    if (/^[IVX]+$/.test(word) && word.length <= 4 && form.lower === 0) result = word;
    else if (word.length <= 6 && form.upper > form.lower + form.capital) result = word;
    else if (form.capital > form.lower) result = capitalize(lower);
    else if (first) result = capitalize(lower);
    first = false;
    return result;
  });
}
