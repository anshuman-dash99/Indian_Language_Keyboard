(() => {
  window.registerIndicLanguage?.({
    id: "en",
    order: 0,
    name: "English",
    nativeName: "English",
    fontFamily: "\"Noto Sans\", Inter, system-ui, sans-serif",
    ui: {
      badge: "Indic Transliteration Keyboard",
      typingArea: "Typing Area",
      quickNotes: "Quick Notes",
      typingRules: "Typing Rules",
      placeholder: "Type here…",
      copy: "Copy Output",
      paste: "Paste",
      clear: "Clear",
      themeDark: "🌙 Dark",
      themeLight: "☀️ Light",
      exportTxt: "Export TXT",
    },
    engine: {
      transliterateWord: (w) => w,
      transliterateText: (t) => t,
      mapDigit: () => null,
      mapPunctuation: () => null,
    },
    quickNotes: [
      {
        title: "Mode",
        lines: ["Select a language and type in English letters to get that script."],
      },
      {
        title: "Tip",
        lines: ["Use Tab to accept the first suggestion.", "Use | for danda (।) in most scripts."],
      },
    ],
    rules: {
      sections: [
        {
          title: "Examples",
          items: [
            { left: "namaste", right: "namaste" },
            { left: "bharat", right: "bharat" },
          ],
        },
      ],
    },
  });
})();

