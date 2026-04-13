(() => {
  const vowelTokens = ["aa", "ii", "uu", "ai", "au", "a", "i", "u", "e", "o"];

  function getNextVowelToken(text, index) {
    for (const v of vowelTokens) {
      if (text.startsWith(v, index)) return v;
    }
    return null;
  }

  function makeMatcher(tokens) {
    const sorted = [...tokens].sort((a, b) => b.length - a.length);
    return (text, index) => {
      for (const t of sorted) {
        if (text.startsWith(t, index)) return t;
      }
      return null;
    };
  }

  function makeBrahmicTransliterator(tables) {
    const {
      independentVowels,
      vowelSigns,
      consonants,
      conjuncts = {},
      anusvara,
      chandrabindu,
      visarga,
      virama,
      digits,
      danda,
      extraTokenOrder = [],
    } = tables;

    const baseTokens = [
      ...extraTokenOrder,
      "ksh",
      "jna",
      "RRu",
      "Ru",
      "MM",
      "M",
      "x",
      "Ny",
      "Ng",
      "chh",
      "kh",
      "gh",
      "jh",
      "th",
      "dh",
      "Dh",
      "Th",
      "ph",
      "bh",
      "sh",
      "Sh",
      "ny",
      "aa",
      "ii",
      "uu",
      "ai",
      "au",
      "a",
      "i",
      "u",
      "e",
      "o",
      "k",
      "g",
      "c",
      "j",
      "t",
      "T",
      "d",
      "D",
      "n",
      "N",
      "p",
      "b",
      "m",
      "y",
      "r",
      "l",
      "L",
      "w",
      "v",
      "s",
      "h",
    ];

    const getToken = makeMatcher([
      ...new Set([
        ...Object.keys(independentVowels || {}),
        ...Object.keys(vowelSigns || {}),
        ...Object.keys(consonants || {}),
        ...Object.keys(conjuncts || {}),
        ...baseTokens,
      ]),
    ]);

    function isConsonantLikeToken(token) {
      return !!(consonants[token] || conjuncts[token] || token === "Ny");
    }

    function transliterateWord(word) {
      let i = 0;
      let result = "";

      while (i < word.length) {
        // Visarga heuristics:
        // - vowel + h at end => visarga (e.g., kah -> कः, duh -> दुः)
        // - vowel + h + consonant => visarga (e.g., duhkha -> दुःख)
        if (word[i] === "h") {
          const prev = word[i - 1] || "";
          const next = word[i + 1] || "";
          const vowels = ["a", "i", "u", "e", "o", "R"];

          // End-of-word visarga (vowel + h)
          if (i === word.length - 1 && vowels.includes(prev)) {
            result += visarga;
            i += 1;
            continue;
          }

          // Inside word (vowel + h + consonant-like)
          if (vowels.includes(prev) && next && /[A-Za-z]/.test(next)) {
            const nextToken = getToken(word, i + 1);
            if (nextToken && isConsonantLikeToken(nextToken)) {
              result += visarga;
              i += 1;
              continue;
            }
          }
        }

        const token = getToken(word, i);
        if (!token) {
          i += 1;
          continue;
        }

        if (token === "MM") {
          result += chandrabindu;
          i += 2;
          continue;
        }

        if (token === "M") {
          result += anusvara;
          i += 1;
          continue;
        }

        if (token === "x") {
          result += virama;
          i += 1;
          continue;
        }

        if (token === "Ny" && consonants.Ny) {
          result += consonants.Ny;
          i += 2;
          continue;
        }

        if (independentVowels[token]) {
          result += independentVowels[token];
          i += token.length;
          continue;
        }

        if (conjuncts[token]) {
          const base = conjuncts[token];
          const nextVowel = getNextVowelToken(word, i + token.length);
          if (nextVowel) {
            result += base + (vowelSigns[nextVowel] ?? "");
            i += token.length + nextVowel.length;
          } else {
            result += base;
            i += token.length;
          }
          continue;
        }

        if (consonants[token]) {
          const base = consonants[token];
          const nextVowel = getNextVowelToken(word, i + token.length);

          if (nextVowel) {
            result += base + (vowelSigns[nextVowel] ?? "");
            i += token.length + nextVowel.length;
          } else {
            const nextToken = getToken(word, i + token.length);
            if (nextToken && isConsonantLikeToken(nextToken)) {
              result += base + virama;
            } else {
              // Many Brahmic scripts treat bare consonant as with inherent 'a'
              result += base;
            }
            i += token.length;
          }
          continue;
        }

        i += 1;
      }

      return result;
    }

    function transliterateText(text) {
      let result = "";
      let current = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (/[A-Za-z]/.test(ch)) {
          current += ch;
        } else {
          if (current) {
            result += transliterateWord(current);
            current = "";
          }
          result += ch;
        }
      }
      if (current) result += transliterateWord(current);
      return result;
    }

    function mapDigit(ch) {
      if (!digits) return null;
      const idx = ch.charCodeAt(0) - 48;
      if (idx < 0 || idx > 9) return null;
      return digits[idx];
    }

    return {
      transliterateWord,
      transliterateText,
      mapDigit,
      mapPunctuation: (ch) => (ch === "|" ? danda : null),
      symbols: { anusvara, chandrabindu, visarga, virama, danda },
    };
  }

  window.IndicCore = {
    makeBrahmicTransliterator,
  };
})();

