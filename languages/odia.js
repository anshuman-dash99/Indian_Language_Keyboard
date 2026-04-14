(() => {
  // Odia engine (ported from your original script.js, kept logically identical)

  const independentVowels = {
    RRu: "ୠ",
    Ru: "ଋ",
    a: "ଅ",
    aa: "ଆ",
    i: "ଇ",
    ii: "ଈ",
    u: "ଉ",
    uu: "ଊ",
    e: "ଏ",
    ai: "ଐ",
    o: "ଓ",
    au: "ଔ",
  };

  const vowelSigns = {
    a: "",
    aa: "ା",
    i: "ି",
    ii: "ୀ",
    u: "ୁ",
    uu: "ୂ",
    e: "େ",
    ai: "ୈ",
    o: "ୋ",
    au: "ୌ",
  };

  const specialSyllables = {
    kRu: "କୃ",
    gRu: "ଗୃ",
    pRu: "ପୃ",
    bRu: "ବୃ",
    dRu: "ଦୃ",
    tRu: "ତୃ",
    mRu: "ମୃ",
    nRu: "ନୃ",
    hRu: "ହୃ",
    rRu: "ରୃ",
  };

  const consonants = {
    ksh: "କ୍ଷ",
    jna: "ଜ୍ଞ",
    rDh: "ଢ଼",
    rD: "ଡ଼",
    rNA: "ର୍ଣ୍ଣ",
    ShN: "ଷ୍ଣ",
    sch: "ଶ୍ଚ",
    njh: "ଞ୍ଝ",
    nj: "ଞ୍ଜ",
    nchh: "ଞ୍ଛ",
    nch: "ଞ୍ଚ",
    NDha: "ଣ୍ଢ",
    NDa: "ଣ୍ଡ",
    NTh: "ଣ୍ଠ",
    NT: "ଣ୍ଟ",
    ngh: "ଙ୍ଘ",
    ng: "ଙ୍ଗ",
    ntha: "ନ୍ଥ",
    nt: "ନ୍ତ",
    ndh: "ନ୍ଧ",
    nd: "ନ୍ଦ",
    nkh: "ଙ୍ଖ",
    nk: "ଙ୍କ",
    mbh: "ମ୍ଭ",
    mb: "ମ୍ବ",
    mpha: "ମ୍ଫ",
    mp: "ମ୍ପ",
    kh: "ଖ",
    gh: "ଘ",
    chh: "ଛ",
    ch: "ଚ",
    jh: "ଝ",
    th: "ଥ",
    Th: "ଠ",
    dh: "ଧ",
    Dh: "ଢ",
    ph: "ଫ",
    bh: "ଭ",
    sh: "ଶ",
    Sh: "ଷ",
    ny: "ନ୍ୟ",
    k: "କ",
    g: "ଗ",
    Ng: "ଙ",
    c: "ଚ",
    j: "ଜ",
    t: "ତ",
    T: "ଟ",
    d: "ଦ",
    D: "ଡ",
    n: "ନ",
    N: "ଣ",
    p: "ପ",
    b: "ବ",
    m: "ମ",
    y: "ୟ",
    Y: "ଯ",
    r: "ର",
    l: "ଲ",
    L: "ଳ",
    w: "ୱ",
    v: "ଭ",
    s: "ସ",
    h: "ହ",
  };

  const conjuncts = {
    shrii: "ଶ୍ରୀ",
    shri: "ଶ୍ରି",
    shr: "ଶ୍ର",
    strii: "ସ୍ତ୍ରୀ",
    stri: "ସ୍ତ୍ରି",
    str: "ସ୍ତ୍ର",
    ktrii: "କ୍ତ୍ରୀ",
    ktri: "କ୍ତ୍ରି",
    ktr: "କ୍ତ୍ର",
    kShma: "କ୍ଷ୍ମ",
    kShmi: "କ୍ଷ୍ମି",
    kShmii: "କ୍ଷ୍ମୀ",
    ryya: "ର୍ଯ୍ୟ",
    rya: "ର୍ଯ",
    kra: "କ୍ର",
    kri: "କ୍ରି",
    kru: "କ୍ରୁ",
    kre: "କ୍ରେ",
    kro: "କ୍ରୋ",
    gra: "ଗ୍ର",
    gri: "ଗ୍ରି",
    gru: "ଗ୍ରୁ",
    pra: "ପ୍ର",
    pri: "ପ୍ରି",
    pru: "ପ୍ରୁ",
    bra: "ବ୍ର",
    bri: "ବ୍ରି",
    bru: "ବ୍ରୁ",
    dra: "ଦ୍ର",
    dri: "ଦ୍ରି",
    dru: "ଦ୍ରୁ",
    tra: "ତ୍ର",
    tri: "ତ୍ରି",
    tru: "ତ୍ରୁ",
    sx: "ସ୍",
  };

  const tokenOrder = [
    "shrii",
    "shri",
    "shr",
    "strii",
    "stri",
    "str",
    "ktrii",
    "ktri",
    "ktr",
    "kShmii",
    "kShmi",
    "kShma",
    "kShm",
    "ksh",
    "jna",
    "RRu",
    "Ru",
    "kRu",
    "gRu",
    "pRu",
    "bRu",
    "dRu",
    "tRu",
    "mRu",
    "nRu",
    "hRu",
    "rRu",
    "rDh",
    "rD",
    "sx",
    "x",
    "MM",
    "M",
    "ryya",
    "sch",
    "njh",
    "nj",
    "nchh",
    "nch",
    "NDha",
    "NDa",
    "NTh",
    "NT",
    "ngh",
    "ng",
    "ntha",
    "nt",
    "ndh",
    "nd",
    "nkh",
    "nk",
    "mbh",
    "mb",
    "mpha",
    "mp",
    "rNA",
    "ShN",
    "rya",
    "kra",
    "kri",
    "kru",
    "kre",
    "kro",
    "gra",
    "gri",
    "gru",
    "pra",
    "pri",
    "pru",
    "bra",
    "bri",
    "bru",
    "dra",
    "dri",
    "dru",
    "tra",
    "tri",
    "tru",
    "chh",
    "kh",
    "gh",
    "ch",
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
    "sx",
    "MM",
    "M",
    "Ny",
    "Ng",
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
    "Y",
    "r",
    "l",
    "L",
    "w",
    "v",
    "s",
    "h",
  ];

  const vowelTokens = ["aa", "ii", "uu", "ai", "au", "a", "i", "u", "e", "o"];

  function getMatchedToken(text, index) {
    for (const token of tokenOrder) {
      if (text.startsWith(token, index)) return token;
    }
    return null;
  }

  function getNextVowelToken(text, index) {
    for (const v of vowelTokens) {
      if (text.startsWith(v, index)) return v;
    }
    return null;
  }

  function isConsonantLikeToken(token) {
    return !!(consonants[token] || conjuncts[token] || specialSyllables[token] || token === "Ny");
  }

  function transliterateWord(word) {
    let i = 0;
    let result = "";

    while (i < word.length) {
      // Visarga rule inside word (Vowel + h + Consonant)
      if (word[i] === "h") {
        const prev = word[i - 1] || "";
        const next = word[i + 1] || "";
        const vowels = ["a", "i", "u", "e", "o", "R"];

        if (vowels.includes(prev) && next && /[a-zA-Z]/.test(next)) {
          const nextToken = getMatchedToken(word, i + 1);
          if (nextToken && isConsonantLikeToken(nextToken)) {
            result += "ଃ";
            i += 1;
            continue;
          }
        }
      }

      // Visarga at end of word (vowel + h)
      if (word[i] === "h" && i === word.length - 1) {
        const prev = word[i - 1] || "";
        const vowels = ["a", "i", "u", "e", "o", "R"];
        if (vowels.includes(prev)) {
          result += "ଃ";
          i += 1;
          continue;
        }
      }

      const token = getMatchedToken(word, i);
      if (!token) {
        i += 1;
        continue;
      }

      if (token === "MM") {
        result += "ଁ";
        i += 2;
        continue;
      }

      if (token === "M") {
        result += "ଂ";
        i += 1;
        continue;
      }

      if (token === "x") {
        result += "୍";
        i += 1;
        continue;
      }

      if (token === "Ny") {
        result += "ଞ";
        i += 2;
        continue;
      }

      if (independentVowels[token]) {
        result += independentVowels[token];
        i += token.length;
        continue;
      }

      if (specialSyllables[token]) {
        result += specialSyllables[token];
        i += token.length;
        continue;
      }

      if (conjuncts[token]) {
        const base = conjuncts[token];
        const nextVowel = getNextVowelToken(word, i + token.length);
        if (nextVowel) {
          result += base + vowelSigns[nextVowel];
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
          result += base + vowelSigns[nextVowel];
          i += token.length + nextVowel.length;
        } else {
          const nextToken = getMatchedToken(word, i + token.length);
          if (nextToken && isConsonantLikeToken(nextToken)) {
            result += base + "୍";
          } else {
            result += base;
          }
          i += token.length;
        }
        continue;
      }

      i += 1;
    }

    result = result
      .replace(/ଅା/g, "ଆ")
      .replace(/ଅି/g, "ଇ")
      .replace(/ଅୀ/g, "ଈ")
      .replace(/ଅୁ/g, "ଉ")
      .replace(/ଅୂ/g, "ଊ")
      .replace(/ଅେ/g, "ଏ")
      .replace(/ଅୈ/g, "ଐ")
      .replace(/ଅୋ/g, "ଓ")
      .replace(/ଅୌ/g, "ଔ")
      .replace(/କ୍ତ୍ରି/g, "କ୍ତ୍ରୀ")
      .replace(/ହଇ/g, "ହି")
      .replace(/ହଉ/g, "ହୁ")
      .replace(/ହଏ/g, "ହେ")
      .replace(/ହଓ/g, "ହୋ");

    return result;
  }

  function transliterateText(text) {
    let result = "";
    let currentWord = "";

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (/[A-Za-z]/.test(ch)) {
        currentWord += ch;
      } else {
        if (currentWord) {
          result += transliterateWord(currentWord);
          currentWord = "";
        }
        result += ch;
      }
    }

    if (currentWord) result += transliterateWord(currentWord);
    return result;
  }

  const digits = ["୦", "୧", "୨", "୩", "୪", "୫", "୬", "୭", "୮", "୯"];

  window.registerIndicLanguage?.({
    id: "or",
    order: 15,
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    fontFamily: "\"Noto Sans Oriya\", \"Noto Sans\", Inter, system-ui, sans-serif",
    engine: {
      transliterateWord,
      transliterateText,
      mapDigit: (ch) => digits[ch.charCodeAt(0) - 48] ?? null,
      mapPunctuation: (ch) => (ch === "|" ? "।" : null),
      // Expose script-specific symbols so the app's "Common rules" panel
      // can render MM/visarga/etc per language (instead of falling back).
      symbols: {
        anusvara: "ଂ",
        chandrabindu: "ଁ",
        visarga: "ଃ",
        virama: "୍",
        danda: "।",
      },
    },
    ui: {
      badge: "ଓଡ଼ିଆ ଲିପ୍ୟନ୍ତରଣ କୀବୋର୍ଡ",
      typingArea: "ଟାଇପିଂ ଏରିଆ",
      quickNotes: "ତୁରନ୍ତ ଟୀକା",
      typingRules: "ଟାଇପିଂ ନିୟମ",
      placeholder: "ଏଠାରେ ଟାଇପ୍ କରନ୍ତୁ…",
      copy: "କପି",
      paste: "ପେଷ୍ଟ",
      clear: "କ୍ଲିୟର",
      themeDark: "🌙 Dark",
      themeLight: "☀️ Light",
      exportTxt: "TXT ଏକ୍ସପୋର୍ଟ",
    },
    quickNotes: [
      {
        title: "Simple rule",
        lines: [
          "Use lowercase for common letters and capitals for special sounds like ଟ, ଠ, ଡ, ଢ, ଣ, ଳ, ଋ, ଙ.",
        ],
      },
      {
        title: "Useful examples",
        lines: [
          "RuShi → ଋଷି, Ng → ଙ, ny → ନ୍ୟ, nj → ଞ୍ଜ, MM → ଁ, ksh → କ୍ଷ, | → ।",
          "duh → ଦୁଃ, kah → କଃ, namah → ନମଃ",
          "tt → ତ୍ତ, dd → ଦ୍ଦ, bd → ବ୍ଦ",
          "barNA → ବର୍ଣ୍ଣ, kRushN → କୃଷ୍ଣ, Yajna → ଯଜ୍ଞ, $ → ₹",
        ],
      },
      {
        title: "Nasal marks",
        lines: ["M → ଂ and MM → ଁ. Example: maamuMM → ମାମୁଁ"],
      },
    ],
    rules: {
      sections: [
        {
          title: "Basic vowels",
          items: [
            { left: "aa", right: "ଆ" },
            { left: "i", right: "ଇ" },
            { left: "ii", right: "ଈ" },
            { left: "u", right: "ଉ" },
            { left: "uu", right: "ଊ" },
            { left: "e", right: "ଏ" },
            { left: "ai", right: "ଐ" },
            { left: "o", right: "ଓ" },
            { left: "au", right: "ଔ" },
            { left: "Ru", right: "ଋ" },
            { left: "RRu", right: "ୠ" },
            { left: "M", right: "ଂ" },
            { left: "MM", right: "ଁ" },
          ],
        },
        {
          title: "Common consonants",
          items: [
            { left: "k", right: "କ" },
            { left: "kh", right: "ଖ" },
            { left: "g", right: "ଗ" },
            { left: "gh", right: "ଘ" },
            { left: "Ng", right: "ଙ" },
            { left: "ch", right: "ଚ" },
            { left: "chh", right: "ଛ" },
            { left: "j", right: "ଜ" },
            { left: "jh", right: "ଝ" },
            { left: "T", right: "ଟ" },
            { left: "Th", right: "ଠ" },
            { left: "D", right: "ଡ" },
            { left: "Dh", right: "ଢ" },
            { left: "N", right: "ଣ" },
            { left: "t", right: "ତ" },
            { left: "th", right: "ଥ" },
            { left: "d", right: "ଦ" },
            { left: "dh", right: "ଧ" },
            { left: "n", right: "ନ" },
          ],
        },
      ],
    },
  });
})();

