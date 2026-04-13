(() => {
  const languages = new Map();

  function registerIndicLanguage(lang) {
    if (!lang || !lang.id) throw new Error("Language must have id");
    languages.set(lang.id, lang);
  }

  function getLanguages() {
    return Array.from(languages.values()).sort((a, b) =>
      (a.order ?? 999) - (b.order ?? 999)
    );
  }

  function getLanguage(id) {
    return languages.get(id) || languages.get("en");
  }

  window.registerIndicLanguage = registerIndicLanguage;
  window.INDIC_LANGUAGES = { getLanguages, getLanguage };
})();

