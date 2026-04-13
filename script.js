document.addEventListener("DOMContentLoaded", () => {

  const output = document.getElementById("output");
  const suggestionsBox = document.getElementById("suggestions");
  const languageSelect = document.getElementById("languageSelect");
  const langPickerBtn = document.getElementById("langPickerBtn");
  const langPickerMenu = document.getElementById("langPickerMenu");
  const langSearch = document.getElementById("langSearch");
  const langList = document.getElementById("langList");
  const emojiBtn = document.getElementById("emojiBtn");
  const emojiMenu = document.getElementById("emojiMenu");
  const emojiSearch = document.getElementById("emojiSearch");
  const emojiClose = document.getElementById("emojiClose");
  const emojiTabs = document.getElementById("emojiTabs");
  const emojiGrid = document.getElementById("emojiGrid");
  const mathBtn = document.getElementById("mathBtn");
  const mathMenu = document.getElementById("mathMenu");
  const mathClose = document.getElementById("mathClose");
  const mathTabs = document.getElementById("mathTabs");
  const mathGrid = document.getElementById("mathGrid");
  const mathBase = document.getElementById("mathBase");
  const mathPower = document.getElementById("mathPower");
  const mathSub = document.getElementById("mathSub");
  const mathRootN = document.getElementById("mathRootN");
  const mathInsertBase = document.getElementById("mathInsertBase");
  const mathInsertPow = document.getElementById("mathInsertPow");
  const mathInsertPowNeg = document.getElementById("mathInsertPowNeg");
  const mathInsertSub = document.getElementById("mathInsertSub");
  const mathInsertSqrt = document.getElementById("mathInsertSqrt");
  const mathInsertNthRoot = document.getElementById("mathInsertNthRoot");
  const exportBtn = document.getElementById("exportBtn");
  const exportMenu = document.getElementById("exportMenu");
  const themeBtn = document.getElementById("themeBtn");
  const themeMenu = document.getElementById("themeMenu");
  const clearBtn = document.getElementById("clearBtn");
  const pasteBtn = document.getElementById("pasteBtn");
  const copyBtn = document.getElementById("copyBtn");
  const downloadTxt = document.getElementById("downloadTxt");
  const downloadPdf = document.getElementById("downloadPdf");
  const exportWords = document.getElementById("exportWords");
  const bufferPreview = document.getElementById("bufferPreview");
  const toast = document.getElementById("toast");

  const badgeText = document.getElementById("badgeText");
  const typingAreaTitle = document.getElementById("typingAreaTitle");
  const typingSubtitle = document.getElementById("typingSubtitle");
  const quickNotesTitle = document.getElementById("quickNotesTitle");
  const typingRulesTitle = document.getElementById("typingRulesTitle");
  const quickNotesBody = document.getElementById("quickNotesBody");
  const typingRulesBody = document.getElementById("typingRulesBody");

  if (!output || !suggestionsBox || !languageSelect) return;

  output.contentEditable = true;

  /* ========================= STATE ========================= */
  let englishBuffer = "";
  let wordStartOffset = null;
  let activeNode = null;
  let isNewLine = false;

  let activeLangId = localStorage.getItem("indic_lang") || "or";
  let activeLang = window.INDIC_LANGUAGES?.getLanguage(activeLangId) || null;

  /* ========================= EMOJIS ========================= */
  const EMOJI_SETS = [
    { id: "recent", label: "🕘", name: "Recent", emojis: [] },
    { id: "smile", label: "😊", name: "Smileys", emojis: ["😀","😃","😄","😁","😆","😅","😂","🤣","😊","🙂","😉","😍","😘","😇","🤩","😎","😢","😭","😡","🤯","😴","🤔","😬","🙃"] },
    { id: "love", label: "❤️", name: "Hearts", emojis: ["❤️","🧡","💛","💚","💙","💜","🤍","🤎","🖤","💖","💘","💝","💯","✨"] },
    { id: "hand", label: "👍", name: "Gestures", emojis: ["👍","👎","👌","✌️","🤞","🤟","🤘","👏","🙏","🫶","💪","👋"] },
    { id: "fire", label: "🔥", name: "Popular", emojis: ["🔥","⭐","🌟","🎉","✅","❌","⚡","☀️","🌙","💡","📌","📎","📢","🚀"] },
  ];

  function loadRecentEmojis() {
    try {
      const arr = JSON.parse(localStorage.getItem("recent_emojis") || "[]");
      return Array.isArray(arr) ? arr.slice(0, 24) : [];
    } catch {
      return [];
    }
  }

  function saveRecentEmoji(e) {
    const recent = loadRecentEmojis();
    const next = [e, ...recent.filter((x) => x !== e)].slice(0, 24);
    localStorage.setItem("recent_emojis", JSON.stringify(next));
  }

  function openEmojiMenu() {
    if (!emojiMenu || !emojiBtn) return;
    emojiMenu.classList.add("open");
    emojiBtn.setAttribute("aria-expanded", "true");
    emojiSearch?.focus();
    if (emojiSearch) emojiSearch.select();
  }

  function closeEmojiMenu() {
    if (!emojiMenu || !emojiBtn) return;
    emojiMenu.classList.remove("open");
    emojiBtn.setAttribute("aria-expanded", "false");
  }

  function insertEmoji(e) {
    output.focus();
    document.execCommand("insertText", false, e);
    saveRecentEmoji(e);
  }

  function renderEmojiTabs(activeTabId) {
    if (!emojiTabs) return;
    emojiTabs.innerHTML = "";
    EMOJI_SETS.forEach((set) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "emoji-tab" + (set.id === activeTabId ? " active" : "");
      b.textContent = set.label;
      b.title = set.name;
      b.addEventListener("click", () => {
        emojiSearch.value = "";
        renderEmojiGrid(set.id, "");
        renderEmojiTabs(set.id);
      });
      emojiTabs.appendChild(b);
    });
  }

  function getAllEmojis() {
    const all = [];
    EMOJI_SETS.forEach((s) => {
      if (s.id === "recent") return;
      all.push(...s.emojis);
    });
    return [...new Set(all)];
  }

  function renderEmojiGrid(tabId = "smile", query = "") {
    if (!emojiGrid) return;
    emojiGrid.innerHTML = "";

    const q = (query || "").trim().toLowerCase();
    let emojis = [];

    if (q) {
      // simple search by curated keyword buckets
      const keywords = [
        { k: ["smile", "happy", "lol"], e: EMOJI_SETS.find((x) => x.id === "smile")?.emojis || [] },
        { k: ["love", "heart"], e: EMOJI_SETS.find((x) => x.id === "love")?.emojis || [] },
        { k: ["hand", "thumb", "clap", "pray"], e: EMOJI_SETS.find((x) => x.id === "hand")?.emojis || [] },
        { k: ["fire", "hot", "star", "party", "rocket", "ok", "check"], e: EMOJI_SETS.find((x) => x.id === "fire")?.emojis || [] },
      ];
      const hit = keywords.find((x) => x.k.some((kw) => q.includes(kw)));
      emojis = hit ? hit.e : getAllEmojis();
    } else if (tabId === "recent") {
      emojis = loadRecentEmojis();
    } else {
      emojis = EMOJI_SETS.find((x) => x.id === tabId)?.emojis || [];
    }

    if (!emojis.length) {
      const empty = document.createElement("div");
      empty.style.gridColumn = "1 / -1";
      empty.style.color = "var(--muted)";
      empty.style.fontWeight = "700";
      empty.textContent = tabId === "recent" ? "No recent emojis yet." : "No emojis found.";
      emojiGrid.appendChild(empty);
      return;
    }

    emojis.forEach((e) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "emoji-btn";
      b.textContent = e;
      b.addEventListener("mousedown", (ev) => ev.preventDefault());
      b.addEventListener("click", () => {
        insertEmoji(e);
        if (tabId === "recent") renderEmojiGrid("recent", "");
      });
      emojiGrid.appendChild(b);
    });
  }

  function initEmojiPicker() {
    if (!emojiBtn || !emojiMenu || !emojiSearch || !emojiClose || !emojiTabs || !emojiGrid) return;
    renderEmojiTabs("smile");
    renderEmojiGrid("smile", "");

    emojiBtn.addEventListener("click", () => {
      if (emojiMenu.classList.contains("open")) closeEmojiMenu();
      else openEmojiMenu();
    });

    emojiClose.addEventListener("click", closeEmojiMenu);
    emojiSearch.addEventListener("input", () => {
      renderEmojiGrid("smile", emojiSearch.value);
      renderEmojiTabs("smile");
    });
    emojiSearch.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeEmojiMenu();
    });

    document.addEventListener("mousedown", (e) => {
      if (!emojiMenu.classList.contains("open")) return;
      const picker = document.getElementById("emojiPicker");
      if (picker && !picker.contains(e.target)) closeEmojiMenu();
    });
  }

  let isMathMode = false;
  let mathBuffer = "";

  let toastTimer = null;
  function showToast(message, timeoutMs = 2200) {
    if (!toast) return;
    if (toastTimer) window.clearTimeout(toastTimer);
    toast.style.display = "flex";
    toast.innerHTML = `<span class="toast-msg">${message}</span><button type="button" class="toast-close" aria-label="Close">✖</button>`;
    toast.querySelector(".toast-close")?.addEventListener("click", () => {
      toast.style.display = "none";
      toast.innerHTML = "";
    });
    toastTimer = window.setTimeout(() => {
      toast.style.display = "none";
      toast.innerHTML = "";
    }, timeoutMs);
  }

  /* ========================= MATH ========================= */
  const MATH_TABS = [
    {
      id: "ops",
      label: "＋",
      items: [
        { t: "+", v: "+" }, { t: "−", v: "−" }, { t: "×", v: "×" }, { t: "÷", v: "÷" },
        { t: "±", v: "±" }, { t: "=", v: "=" }, { t: "≠", v: "≠" }, { t: "≈", v: "≈" },
        { t: "≤", v: "≤" }, { t: "≥", v: "≥" }, { t: "<", v: "<" }, { t: ">", v: ">" },
      ],
    },
    {
      id: "pow",
      label: "x²",
      items: [
        { t: "²", v: "²", d: "square" },
        { t: "³", v: "³", d: "cube" },
        { t: "ⁿ", v: "ⁿ", d: "power n" },
        { t: "ₙ", v: "ₙ", d: "under n" },
      ],
    },
    {
      id: "root",
      label: "√",
      items: [
        { t: "√()", v: "√()", d: "sqrt", caretLeft: 1 },
        { t: "∛()", v: "∛()", d: "cuberoot", caretLeft: 1 },
        { t: "ⁿ√()", v: "ⁿ√()", d: "nthroot", caretLeft: 1 },
      ],
    },
    {
      id: "func",
      label: "f()",
      items: [
        { t: "sin()", v: "sin()", caretLeft: 1 },
        { t: "cos()", v: "cos()", caretLeft: 1 },
        { t: "tan()", v: "tan()", caretLeft: 1 },
        { t: "log()", v: "log()", caretLeft: 1 },
        { t: "ln()", v: "ln()", caretLeft: 1 },
        { t: "π", v: "π" },
        { t: "∞", v: "∞" },
        { t: "∑", v: "∑" },
        { t: "∫", v: "∫" },
      ],
    },
    {
      id: "sets",
      label: "ℝ",
      items: [
        { t: "ℕ", v: "ℕ", d: "Naturals" },
        { t: "ℤ", v: "ℤ", d: "Integers" },
        { t: "ℚ", v: "ℚ", d: "Rationals" },
        { t: "ℝ", v: "ℝ", d: "Reals" },
        { t: "ℂ", v: "ℂ", d: "Complex" },
        { t: "∈", v: "∈", d: "in" },
        { t: "∉", v: "∉", d: "not in" },
        { t: "⊂", v: "⊂", d: "subset" },
        { t: "⊆", v: "⊆", d: "subseteq" },
        { t: "∪", v: "∪", d: "union" },
        { t: "∩", v: "∩", d: "intersection" },
        { t: "{ }", v: "{ }", d: "set", caretLeft: 2 },
      ],
    },
  ];

  const SUP = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
    "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾",
    "n": "ⁿ", "i": "ⁱ",
  };
  const SUB = {
    "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
    "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎",
    "n": "ₙ",
  };

  function toSuperscript(s) {
    return (s || "").split("").map((ch) => SUP[ch] ?? SUP[ch.toLowerCase()] ?? ch).join("");
  }

  function toSubscript(s) {
    return (s || "").split("").map((ch) => SUB[ch] ?? SUB[ch.toLowerCase()] ?? ch).join("");
  }

  function mathConvert(text) {
    let t = text || "";

    // Normalize operators
    // Keep "*" as-is (plain x*y), per preference.

    // Keep "/" as-is (plain x/y), per preference.

    // <= >=
    t = t.replace(/<=/g, "≤").replace(/>=/g, "≥");

    // Power: base ^ exponent  (supports negative exponent)
    t = t.replace(/([A-Za-z\)\]0-9]+)\^\(?(-?[A-Za-z0-9]+)\)?/g, (_m, base, exp) => {
      return `${base}${toSuperscript(exp)}`;
    });

    // Coefficient/subscript: letter followed by digits => x₁₂
    t = t.replace(/([A-Za-z])([0-9]{1,6})/g, (_m, base, sub) => `${base}${toSubscript(sub)}`);

    return t;
  }

  function mathCommit(text) {
    const raw = (text || "").trim();
    if (!raw) return { text: "", caretLeft: 0 };

    const k = raw.toLowerCase();
    const map = {
      pi: "π",
      inf: "∞",
      sum: "∑",
      int: "∫",
      u: "∪",
      n: "∩",
      in: "∈",
      notin: "∉",
      sub: "⊂",
      sube: "⊆",
      sup: "⊃",
      supe: "⊇",
    };

    // Root templates
    if (k === "sqrt") return { text: "√()", caretLeft: 1 };
    if (k === "cbrt") return { text: "∛()", caretLeft: 1 };
    if (k === "nthroot") return { text: "ⁿ√()", caretLeft: 1 };

    // Function templates
    if (k === "sin" || k === "cos" || k === "tan" || k === "log" || k === "ln") {
      return { text: `${k}()`, caretLeft: 1 };
    }

    if (map[k]) return { text: map[k], caretLeft: 0 };
    return { text: mathConvert(raw), caretLeft: 0 };
  }

  function openMathMenu() {
    if (!mathMenu || !mathBtn) return;
    mathMenu.classList.add("open");
    mathBtn.setAttribute("aria-expanded", "true");
  }
  function closeMathMenu() {
    if (!mathMenu || !mathBtn) return;
    mathMenu.classList.remove("open");
    mathBtn.setAttribute("aria-expanded", "false");
  }

  function moveCaretLeft(n) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const node = range.startContainer;
    if (node.nodeType !== 3) return;
    const pos = Math.max(0, range.startOffset - n);
    range.setStart(node, pos);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function insertMath(item) {
    output.focus();
    document.execCommand("insertText", false, item.v);
    if (item.caretLeft) moveCaretLeft(item.caretLeft);
  }

  function renderMathTabs(activeId) {
    if (!mathTabs) return;
    mathTabs.innerHTML = "";
    MATH_TABS.forEach((tab) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "math-tab" + (tab.id === activeId ? " active" : "");
      b.textContent = tab.label;
      b.addEventListener("click", () => {
        renderMathTabs(tab.id);
        renderMathGrid(tab.id);
      });
      mathTabs.appendChild(b);
    });
  }

  function renderMathGrid(tabId) {
    if (!mathGrid) return;
    mathGrid.innerHTML = "";
    const tab = MATH_TABS.find((t) => t.id === tabId) || MATH_TABS[0];
    tab.items.forEach((it) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "math-btn";
      b.innerHTML = `${it.t}${it.d ? `<small>${it.d}</small>` : ""}`;
      b.addEventListener("mousedown", (e) => e.preventDefault());
      b.addEventListener("click", () => insertMath(it));
      mathGrid.appendChild(b);
    });
  }

  function initMathPicker() {
    if (!mathBtn || !mathMenu || !mathClose || !mathTabs || !mathGrid) return;
    renderMathTabs("ops");
    renderMathGrid("ops");

    mathBtn.addEventListener("click", () => {
      isMathMode = !isMathMode;
      mathBuffer = "";
      resetState();
      showSuggestions([]);
      setBufferPreview("", "");
      showToast(isMathMode ? "🧮 Math mode ON" : "🧮 Math mode OFF");
      // Update right-side rules to show/hide math shortcuts
      if (activeLang) renderRules(activeLang);
      if (isMathMode) openMathMenu();
      else closeMathMenu();
    });

    mathClose.addEventListener("click", closeMathMenu);

    document.addEventListener("mousedown", (e) => {
      if (!mathMenu.classList.contains("open")) return;
      const picker = document.getElementById("mathPicker");
      if (picker && !picker.contains(e.target)) closeMathMenu();
    });

    // Builder actions
    const getBase = () => (mathBase?.value || "x").trim() || "x";
    mathInsertBase?.addEventListener("click", () => insertMath({ v: getBase() }));

    mathInsertPow?.addEventListener("click", () => {
      const base = getBase();
      const p = (mathPower?.value || "").trim() || "2";
      insertMath({ v: base + toSuperscript(p) });
    });

    mathInsertPowNeg?.addEventListener("click", () => {
      const base = getBase();
      const p = (mathPower?.value || "").trim() || "1";
      insertMath({ v: base + toSuperscript("-" + p) });
    });

    mathInsertSub?.addEventListener("click", () => {
      const base = getBase();
      const s = (mathSub?.value || "").trim() || "2";
      insertMath({ v: base + toSubscript(s) });
    });

    mathInsertSqrt?.addEventListener("click", () => {
      insertMath({ v: "√()", caretLeft: 1 });
    });

    mathInsertNthRoot?.addEventListener("click", () => {
      const n = (mathRootN?.value || "").trim() || "n";
      insertMath({ v: toSuperscript(n) + "√()", caretLeft: 1 });
    });
  }

  function setBufferPreview(roman, converted) {
    if (!bufferPreview) return;
    if (!roman) {
      bufferPreview.style.display = "none";
      bufferPreview.innerHTML = "";
      return;
    }
    bufferPreview.style.display = "flex";
    bufferPreview.innerHTML = `<span><b>${roman}</b> → ${converted || ""}</span><span class="chip chip-muted">Tab = accept</span>`;
  }

  /* ========================= LANGUAGE ========================= */
  function setAppFont(fontFamily) {
    document.documentElement.style.setProperty("--app-font", fontFamily);
  }

  function renderQuickNotes(lang) {
    if (!quickNotesBody) return;
    quickNotesBody.innerHTML = "";

    (lang.quickNotes || []).forEach((block) => {
      const item = document.createElement("div");
      item.className = "info-item";

      const strong = document.createElement("strong");
      strong.textContent = block.title || "";
      item.appendChild(strong);

      (block.lines || []).forEach((line) => {
        const span = document.createElement("span");
        span.textContent = line;
        item.appendChild(span);
      });

      quickNotesBody.appendChild(item);
    });
  }

  function renderRules(lang) {
    if (!typingRulesBody) return;
    typingRulesBody.innerHTML = "";

    // Math mode rules should come first (only when Math is ON)
    if (isMathMode) {
      const mDetails = document.createElement("details");
      mDetails.open = true;

      const mSummary = document.createElement("summary");
      mSummary.textContent = "Math mode shortcuts";
      mDetails.appendChild(mSummary);

      const mBody = document.createElement("div");
      mBody.className = "details-body";

      const mGrid = document.createElement("div");
      mGrid.className = "rule-grid";

      const mItems = [
        { left: "x^2", right: "x²" },
        { left: "x^3", right: "x³" },
        { left: "x^-2", right: "x⁻²" },
        { left: "sin^2", right: "sin²" },
        { left: "x1", right: "x₁" },
        { left: "x12", right: "x₁₂" },
        { left: "x/y", right: "x/y" },
        { left: "x / y", right: "x / y" },
        { left: "x*y", right: "x*y" },
        { left: "<=", right: "≤" },
        { left: ">=", right: "≥" },
        { left: "sqrt", right: "√()" },
        { left: "cbrt", right: "∛()" },
        { left: "nthroot", right: "ⁿ√()" },
        { left: "sin / cos / tan", right: "sin() / cos() / tan()" },
        { left: "log / ln", right: "log() / ln()" },
        { left: "int", right: "∫" },
        { left: "sum", right: "∑" },
        { left: "pi", right: "π" },
        { left: "inf", right: "∞" },
        { left: "U", right: "∪ (union)" },
        { left: "N", right: "∩ (intersection)" },
        { left: "in", right: "∈" },
        { left: "notin", right: "∉" },
        { left: "sub / sube", right: "⊂ / ⊆" },
        { left: "sup / supe", right: "⊃ / ⊇" },
      ];

      mItems.forEach((it) => {
        const row = document.createElement("div");
        row.className = "rule-item";

        const left = document.createElement("b");
        left.textContent = it.left;
        row.appendChild(left);

        row.appendChild(document.createTextNode(" → "));

        const right = document.createElement("span");
        right.textContent = it.right;
        row.appendChild(right);

        mGrid.appendChild(row);
      });

      mBody.appendChild(mGrid);
      mDetails.appendChild(mBody);
      typingRulesBody.appendChild(mDetails);
    }

    const sections = lang.rules?.sections || [];
    sections.forEach((section) => {
      const details = document.createElement("details");
      details.open = false;

      const summary = document.createElement("summary");
      summary.textContent = section.title || "";
      details.appendChild(summary);

      const body = document.createElement("div");
      body.className = "details-body";

      const grid = document.createElement("div");
      grid.className = "rule-grid";

      (section.items || []).forEach((it) => {
        const row = document.createElement("div");
        row.className = "rule-item";

        const left = document.createElement("b");
        left.textContent = it.left ?? "";
        row.appendChild(left);

        const arrow = document.createTextNode(" → ");
        row.appendChild(arrow);

        const right = document.createElement("span");
        right.textContent = it.right ?? "";
        row.appendChild(right);

        grid.appendChild(row);
      });

      body.appendChild(grid);
      details.appendChild(body);
      typingRulesBody.appendChild(details);
    });

    // Always show a common rules section (helps every language)
    const symbols = lang.engine?.symbols || {};
    const virama = symbols.virama || "्";
    const anusvara = symbols.anusvara || "ं";
    const chandrabindu = symbols.chandrabindu || "ँ";
    const visarga = symbols.visarga || "ः";
    const danda = symbols.danda || "।";

    const commonDetails = document.createElement("details");
    commonDetails.open = true;

    const commonSummary = document.createElement("summary");
    commonSummary.textContent = "Common rules (all languages)";
    commonDetails.appendChild(commonSummary);

    const commonBody = document.createElement("div");
    commonBody.className = "details-body";

    const commonGrid = document.createElement("div");
    commonGrid.className = "rule-grid";

    const commonItems = [
      { left: "x", right: `${virama} (halant/virama)` },
      { left: "M", right: `${anusvara}` },
      { left: "MM", right: `${chandrabindu}` },
      { left: "h (after vowel)", right: `${visarga} (visarga)` },
      { left: "|", right: `${danda}` },
      { left: "Tab", right: "accept first suggestion" },
    ];

    commonItems.forEach((it) => {
      const row = document.createElement("div");
      row.className = "rule-item";

      const left = document.createElement("b");
      left.textContent = it.left;
      row.appendChild(left);

      row.appendChild(document.createTextNode(" → "));

      const right = document.createElement("span");
      right.textContent = it.right;
      row.appendChild(right);

      commonGrid.appendChild(row);
    });

    commonBody.appendChild(commonGrid);
    commonDetails.appendChild(commonBody);
    typingRulesBody.appendChild(commonDetails);

    // Yuktakshara / conjunct examples (rendered per language)
    const engine = lang.engine;
    if (engine?.transliterateWord) {
      const yDetails = document.createElement("details");
      yDetails.open = false;

      const ySummary = document.createElement("summary");
      ySummary.textContent = "Yuktakshara (conjunct) examples";
      yDetails.appendChild(ySummary);

      const yBody = document.createElement("div");
      yBody.className = "details-body";

      const yGrid = document.createElement("div");
      yGrid.className = "rule-grid";

      const examples = [
        { left: "Ngk", right: engine.transliterateWord("Ngk") },   // ঙ্ + ক => ঙ্ক / ङ्क / ଙ୍କ
        { left: "Ngkh", right: engine.transliterateWord("Ngkh") },
        { left: "Ngga", right: engine.transliterateWord("Ngga") },
        { left: "Ny", right: engine.transliterateWord("Ny") },
        { left: "duh", right: engine.transliterateWord("duh") },
        { left: "kah", right: engine.transliterateWord("kah") },
        { left: "namah", right: engine.transliterateWord("namah") },
        { left: "nka", right: engine.transliterateWord("nka") },
        { left: "nkha", right: engine.transliterateWord("nkha") },
        { left: "nga", right: engine.transliterateWord("nga") },
        { left: "ngha", right: engine.transliterateWord("ngha") },
        { left: "nja", right: engine.transliterateWord("nja") },
        { left: "njha", right: engine.transliterateWord("njha") },
        { left: "ncha", right: engine.transliterateWord("ncha") },
        { left: "nchha", right: engine.transliterateWord("nchha") },
        { left: "ntra", right: engine.transliterateWord("ntra") }, // ন্ + ত্র => ন্ত্র / न्त्र / ନ୍ତ୍ର
        { left: "ktra", right: engine.transliterateWord("ktra") },
        { left: "shri", right: engine.transliterateWord("shri") },
        { left: "ksh", right: engine.transliterateWord("ksh") },
        { left: "jna", right: engine.transliterateWord("jna") },
        { left: "tt", right: engine.transliterateWord("tt") },
        { left: "dd", right: engine.transliterateWord("dd") },
        { left: "bd", right: engine.transliterateWord("bd") },
        { left: "kx", right: engine.transliterateWord("kx") },     // force halant: क् / କ୍ / ক্
      ];

      examples.forEach((it) => {
        const row = document.createElement("div");
        row.className = "rule-item";

        const left = document.createElement("b");
        left.textContent = it.left;
        row.appendChild(left);

        row.appendChild(document.createTextNode(" → "));

        const right = document.createElement("span");
        right.textContent = it.right;
        row.appendChild(right);

        yGrid.appendChild(row);
      });

      yBody.appendChild(yGrid);
      yDetails.appendChild(yBody);
      typingRulesBody.appendChild(yDetails);
    }
  }

  function applyLanguageUI(lang) {
    const ui = lang.ui || {};

    if (badgeText) badgeText.textContent = ui.badge || "Indic Transliteration Keyboard";
    if (typingAreaTitle) typingAreaTitle.textContent = ui.typingArea || "Typing Area";
    if (typingSubtitle) typingSubtitle.textContent = ui.typingSubtitle || "Type in English letters. Press Tab to accept suggestions.";
    if (quickNotesTitle) quickNotesTitle.textContent = ui.quickNotes || "Quick Notes";
    if (typingRulesTitle) typingRulesTitle.textContent = ui.typingRules || "Typing Rules";

    if (copyBtn) copyBtn.textContent = ui.copy || "Copy Output";
    if (pasteBtn) pasteBtn.textContent = ui.paste || "Paste";
    if (clearBtn) clearBtn.textContent = ui.clear || "Clear";
    if (exportWords) exportWords.textContent = ui.exportWords || "🧠 Export Words";
    if (downloadPdf) downloadPdf.textContent = ui.exportPdf || "🧾 Export PDF";
    if (downloadTxt) downloadTxt.textContent = ui.exportTxt || "Export TXT";

    output.setAttribute("data-placeholder", ui.placeholder || "Type here…");
    setAppFont(lang.fontFamily || "\"Noto Sans\", Inter, system-ui, sans-serif");

    renderQuickNotes(lang);
    renderRules(lang);
  }

  function applyLanguage(langId) {
    activeLangId = langId;
    localStorage.setItem("indic_lang", activeLangId);
    activeLang = window.INDIC_LANGUAGES?.getLanguage(activeLangId) || window.INDIC_LANGUAGES?.getLanguage("en");

    resetState();
    showSuggestions([]);
    applyLanguageUI(activeLang);
    updateLangPickerLabel();
    setBufferPreview("", "");
    showToast(`✅ Language set to ${activeLang?.name || langId}`);
  }

  function initLanguageSelect() {
    const langs = window.INDIC_LANGUAGES?.getLanguages?.() || [];
    languageSelect.innerHTML = "";

    langs.forEach((lang) => {
      const opt = document.createElement("option");
      opt.value = lang.id;
      opt.textContent = `${lang.nativeName || lang.name} (${lang.name})`;
      languageSelect.appendChild(opt);
    });

    if (![...langs].some((l) => l.id === activeLangId)) {
      activeLangId = "en";
    }

    languageSelect.value = activeLangId;
    languageSelect.addEventListener("change", () => applyLanguage(languageSelect.value));
    initLangPicker(langs);
    applyLanguage(activeLangId);
  }

  function closeLangMenu() {
    langPickerMenu?.classList.remove("open");
    if (langPickerBtn) langPickerBtn.setAttribute("aria-expanded", "false");
  }

  function openLangMenu() {
    if (!langPickerMenu) return;
    langPickerMenu.classList.add("open");
    if (langPickerBtn) langPickerBtn.setAttribute("aria-expanded", "true");
    langSearch?.focus();
    if (langSearch) langSearch.select();
  }

  function renderLangList(langs, filterText = "") {
    if (!langList) return;
    const f = (filterText || "").trim().toLowerCase();
    langList.innerHTML = "";

    const filtered = !f
      ? langs
      : langs.filter((l) => {
          const a = `${l.name || ""} ${l.nativeName || ""} ${l.id || ""}`.toLowerCase();
          return a.includes(f);
        });

    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "lang-item";
      empty.style.cursor = "default";
      empty.innerHTML = `<div class="native">No matches</div><div class="english">Try another search</div>`;
      langList.appendChild(empty);
      return;
    }

    filtered.forEach((lang) => {
      const item = document.createElement("div");
      item.className = "lang-item" + (lang.id === activeLangId ? " active" : "");
      item.setAttribute("role", "option");
      item.dataset.langId = lang.id;
      item.innerHTML = `<div class="native">${lang.nativeName || lang.name}</div><div class="english">${lang.name} • ${lang.id}</div>`;
      item.addEventListener("mousedown", (e) => e.preventDefault());
      item.addEventListener("click", () => {
        applyLanguage(lang.id);
        if (languageSelect) languageSelect.value = lang.id;
        closeLangMenu();
      });
      langList.appendChild(item);
    });
  }

  function updateLangPickerLabel() {
    if (!langPickerBtn) return;
    const l = window.INDIC_LANGUAGES?.getLanguage(activeLangId);
    langPickerBtn.textContent = l ? `🌐 ${l.nativeName || l.name}` : "🌐 Language";
  }

  /* ========================= EXPORT MENU ========================= */
  function closeExportMenu() {
    exportMenu?.classList.remove("open");
    if (exportBtn) exportBtn.setAttribute("aria-expanded", "false");
  }

  function openExportMenu() {
    if (!exportMenu) return;
    exportMenu.classList.add("open");
    if (exportBtn) exportBtn.setAttribute("aria-expanded", "true");
  }

  function initExportMenu() {
    if (!exportBtn || !exportMenu) return;
    exportBtn.addEventListener("click", () => {
      if (exportMenu.classList.contains("open")) closeExportMenu();
      else openExportMenu();
    });

    document.addEventListener("mousedown", (e) => {
      if (!exportMenu.classList.contains("open")) return;
      const picker = document.getElementById("exportPicker");
      if (picker && !picker.contains(e.target)) closeExportMenu();
    });
  }

  function initLangPicker(langs) {
    if (!langPickerBtn || !langPickerMenu || !langList || !langSearch) return;

    updateLangPickerLabel();
    renderLangList(langs, "");

    langPickerBtn.addEventListener("click", () => {
      if (langPickerMenu.classList.contains("open")) closeLangMenu();
      else openLangMenu();
    });

    langSearch.addEventListener("input", () => renderLangList(langs, langSearch.value));
    langSearch.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLangMenu();
      if (e.key === "Enter") {
        const first = langList.querySelector(".lang-item[data-lang-id]");
        const id = first?.getAttribute("data-lang-id");
        if (id) {
          applyLanguage(id);
          if (languageSelect) languageSelect.value = id;
          closeLangMenu();
        }
      }
    });

    document.addEventListener("mousedown", (e) => {
      if (!langPickerMenu.classList.contains("open")) return;
      const picker = document.getElementById("langPicker");
      if (picker && !picker.contains(e.target)) closeLangMenu();
    });
  }

/* ========================= THEME ========================= */
  const THEMES = [
    { id: "dark", label: "🌙 Dark", swatch: "#4f9cff" },
    { id: "light", label: "☀️ Light", swatch: "#2563eb" },
    { id: "ocean", label: "🌊 Ocean", swatch: "#22d3ee" },
    { id: "sunset", label: "🌇 Sunset", swatch: "#fb7185" },
    { id: "forest", label: "🌿 Forest", swatch: "#34d399" },
    { id: "midnight", label: "🌌 Midnight", swatch: "#a78bfa" },
    { id: "slate", label: "🪨 Slate", swatch: "#94a3b8" },
  ];

  function applyTheme(themeId) {
    const id = THEMES.some((t) => t.id === themeId) ? themeId : "dark";
    document.body.dataset.theme = id;
    // Back-compat: keep .light class for light-mode specific CSS
    document.body.classList.toggle("light", id === "light");
    localStorage.setItem("theme", id);
    renderThemeMenu();
  }

  function getSavedTheme() {
    const saved = localStorage.getItem("theme") || "dark";
    return THEMES.some((t) => t.id === saved) ? saved : "dark";
  }

  function closeThemeMenu() {
    themeMenu?.classList.remove("open");
    themeBtn?.setAttribute("aria-expanded", "false");
  }

  function openThemeMenu() {
    if (!themeMenu) return;
    themeMenu.classList.add("open");
    themeBtn?.setAttribute("aria-expanded", "true");
  }

  function renderThemeMenu() {
    if (!themeMenu || !themeBtn) return;
    const current = document.body.dataset.theme || "dark";
    themeMenu.innerHTML = "";

    THEMES.forEach((t) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "theme-item" + (t.id === current ? " active" : "");
      b.innerHTML = `<span style="display:flex;gap:10px;align-items:center;"><span class="theme-swatch" style="background:${t.swatch}"></span>${t.label}</span>`;
      b.addEventListener("click", () => {
        applyTheme(t.id);
        showToast(`🎨 Theme: ${t.label}`);
        closeThemeMenu();
      });
      themeMenu.appendChild(b);
    });

    themeBtn.textContent = "🎨 Theme";
  }

  function initThemeMenu() {
    if (!themeBtn || !themeMenu) return;
    renderThemeMenu();

    themeBtn.addEventListener("click", () => {
      if (themeMenu.classList.contains("open")) closeThemeMenu();
      else openThemeMenu();
    });

    document.addEventListener("mousedown", (e) => {
      if (!themeMenu.classList.contains("open")) return;
      const picker = document.getElementById("themePicker");
      if (picker && !picker.contains(e.target)) closeThemeMenu();
    });
  }

  applyTheme(getSavedTheme());
  initThemeMenu();

/* ========================= STORAGE ========================= */
  const dictKey = () => `dict_${activeLangId}`;
  const bigramKey = () => `bigram_${activeLangId}`;

  const getDict = () => JSON.parse(localStorage.getItem(dictKey()) || "{}");
  const saveDict = (d) => localStorage.setItem(dictKey(), JSON.stringify(d));

  const getBigram = () => JSON.parse(localStorage.getItem(bigramKey()) || "{}");
  const saveBigram = (b) => localStorage.setItem(bigramKey(), JSON.stringify(b));

/* ========================= LEARNING ========================= */
  function learnWord(word) {
    if (!word) return;
    const dict = getDict();
    dict[word] = dict[word]
      ? { freq: dict[word].freq + 1, time: Date.now() }
      : { freq: 1, time: Date.now() };
    saveDict(dict);
  }

  function learnBigram(prev, curr) {
    if (!prev || !curr) return;
    const bigram = getBigram();
    const key = prev + "|" + curr;
    bigram[key] = (bigram[key] || 0) + 1;
    saveBigram(bigram);
  }

/* ========================= SUGGESTIONS ========================= */
  function scoreWord(data) {
    return data.freq * 2 + (Date.now() - data.time < 86400000 ? 5 : 0);
  }

  function editDistance(a, b) {
    const dp = Array(a.length + 1).fill().map(() => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + 1);
      }
    }
    return dp[a.length][b.length];
  }

  function getSuggestions(prefix, limit = 5) {
    if (!prefix) return [];
    const dict = getDict();
    let results = [];

    for (const word in dict) {
      const data = dict[word];

      if (word.startsWith(prefix)) {
        results.push({ word, score: scoreWord(data) + 10 });
        continue;
      }

      const dist = editDistance(prefix, word.slice(0, prefix.length + 1));
      if (dist <= 2) {
        results.push({ word, score: scoreWord(data) - dist });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(e => e.word);
  }

  function predictNextWord(limit = 5) {
    const text = output.innerText.trim();
    if (!text) return [];

    const words = text.split(/\s+/);
    const last = words[words.length - 1];

    const bigram = getBigram();
    let results = [];

    for (const key in bigram) {
      if (key.startsWith(last + "|")) {
        const next = key.split("|")[1];
        results.push({ word: next, score: bigram[key] });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(e => e.word);
  }

/* ========================= CURSOR ========================= */
  function getSafeNode() {
    const sel = window.getSelection();
    if (!sel.rangeCount) return null;

    let node = sel.getRangeAt(0).startContainer;

    if (node.nodeType !== 3) {
      const textNode = document.createTextNode("");
      node.appendChild(textNode);

      const range = document.createRange();
      range.setStart(textNode, 0);
      range.collapse(true);

      sel.removeAllRanges();
      sel.addRange(range);

      return textNode;
    }
    return node;
  }

  function replaceWord(newWord) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    let node = getSafeNode();
    const range = sel.getRangeAt(0);

    if (wordStartOffset === null || activeNode !== node || isNewLine) {
      wordStartOffset = range.startOffset;
      activeNode = node;
      isNewLine = false;
    }

    const text = node.textContent;
    const before = text.slice(0, wordStartOffset);
    const after = text.slice(range.startOffset);

    node.textContent = before + newWord + after;

    const newPos = before.length + newWord.length;

    const newRange = document.createRange();
    newRange.setStart(node, newPos);
    newRange.collapse(true);

    sel.removeAllRanges();
    sel.addRange(newRange);
  }

  function resetState() {
    englishBuffer = "";
    wordStartOffset = null;
    activeNode = null;
  }

/* ========================= UI ========================= */
  function showSuggestions(list) {
    suggestionsBox.innerHTML = "";

    if (!list.length) {
      suggestionsBox.style.display = "none";
      return;
    }

    suggestionsBox.style.display = "flex";

    list.forEach((word) => {
      const el = document.createElement("span");
      el.className = "suggestion";
      el.innerText = word;

      el.onmousedown = (e) => {
        e.preventDefault();
        insertSuggestion(word);
      };

      suggestionsBox.appendChild(el);
    });
  }

  function insertSuggestion(word) {
    replaceWord(word);
    document.execCommand("insertText", false, " ");
    learnWord(word);

    const words = output.innerText.trim().split(/\s+/);
    const prev = words[words.length - 2];
    learnBigram(prev, word);

    resetState();
    showSuggestions(predictNextWord());
  }

  /* ========================= BASIC ACTIONS ========================= */
  clearBtn?.addEventListener("click", () => {
    output.innerHTML = "";
    resetState();
    showSuggestions([]);
    setBufferPreview("", "");
    showToast("🧹 Cleared");
  });

  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(output.innerText || "");
      showToast("📋 Copied!");
    } catch {
      // fallback
      const range = document.createRange();
      range.selectNodeContents(output);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand("copy");
      sel.removeAllRanges();
      showToast("📋 Copied!");
    }
  });

  pasteBtn?.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return;

      const engine = activeLang?.engine;
      const converted = engine?.transliterateText ? engine.transliterateText(text) : text;
      document.execCommand("insertText", false, converted);

      resetState();
      showSuggestions([]);
      setBufferPreview("", "");
      showToast("📥 Pasted");
    } catch {
      showToast("⚠️ Paste blocked by browser permissions");
    }
  });

  downloadTxt?.addEventListener("click", () => {
    const text = output.innerText || "";
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `output_${activeLangId}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 0);
    showToast("⬇️ Exported TXT");
    closeExportMenu();
  });

  exportWords?.addEventListener("click", () => {
    try {
      const payload = {
        app: "Indic_key",
        version: 1,
        language: {
          id: activeLangId,
          name: activeLang?.name,
          nativeName: activeLang?.nativeName,
        },
        exportedAt: new Date().toISOString(),
        dict: getDict(),
        bigram: getBigram(),
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `learned_words_${activeLangId}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 0);
      showToast("🧠 Exported learned words");
      closeExportMenu();
    } catch {
      showToast("⚠️ Could not export words");
    }
  });

  downloadPdf?.addEventListener("click", () => {
    const text = output.innerText || "";
    if (!text.trim()) {
      showToast("⚠️ Nothing to export");
      return;
    }

    const title = activeLang?.name ? `${activeLang.name} Output` : "Output";
    const w = window.open("", "_blank");
    if (!w) {
      showToast("⚠️ Popup blocked (allow popups)");
      return;
    }

    const font = activeLang?.fontFamily || "Noto Sans, system-ui, sans-serif";
    w.document.open();
    w.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: ${font}; padding: 24px; }
    h1 { font-size: 18px; margin: 0 0 12px; }
    pre { white-space: pre-wrap; word-break: break-word; font-size: 16px; line-height: 1.7; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <pre>${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
  <script>
    window.onload = () => { window.print(); };
  </script>
</body>
</html>`);
    w.document.close();
    showToast("🧾 Opened PDF export (Print → Save as PDF)");
    closeExportMenu();
  });

/* ========================= INPUT ========================= */
  output.addEventListener("beforeinput", (e) => {
    const engine = activeLang?.engine;
    const isEnglishMode = activeLangId === "en" || !engine?.transliterateWord;
    const mathShorthand = {
      sqrt: "√",
      cbrt: "∛",
      nthroot: "ⁿ√",
      pi: "π",
      inf: "∞",
      sum: "∑",
      int: "∫",
      U: "∪",
      N: "∩",
      in: "∈",
      notin: "∉",
      sub: "⊂",
      sube: "⊆",
      sup: "⊃",
      supe: "⊇",
    };

    if (e.inputType === "insertText" && /^[a-zA-Z]$/.test(e.data)) {
      if (isMathMode) {
        // capture into math buffer and render as transformed math while typing
        e.preventDefault();
        mathBuffer += e.data;
        const converted = mathConvert(mathBuffer);
        replaceWord(converted);
        setBufferPreview(mathBuffer, mathShorthand[mathBuffer] || mathShorthand[mathBuffer.toLowerCase()] || "");
        return;
      }
      if (isEnglishMode) return;
      e.preventDefault();

      englishBuffer += e.data;
      const converted = engine.transliterateWord(englishBuffer);
      replaceWord(converted);
      showSuggestions(getSuggestions(converted));
      setBufferPreview(englishBuffer, converted);
      return;
    }

    if (e.inputType === "insertText" && e.data === " ") {
      if (isMathMode) {
        // If there's no active math buffer, just insert a normal space.
        if (!mathBuffer) return;
        e.preventDefault();
        const committed = mathCommit(mathBuffer);
        replaceWord(committed.text);
        if (committed.caretLeft) moveCaretLeft(committed.caretLeft);
        // For templates like sin() / √(), keep cursor inside () (no trailing space).
        if (!committed.caretLeft) {
          document.execCommand("insertText", false, " ");
        }
        mathBuffer = "";
        setBufferPreview("", "");
        // Start next math token at new cursor position (don't overwrite previous).
        resetState();
        return;
      }
      if (isEnglishMode) return;
      e.preventDefault();

      const converted = engine.transliterateWord(englishBuffer);
      replaceWord(converted);
      setBufferPreview("", "");

      const words = output.innerText.trim().split(/\s+/);
      const prev = words[words.length - 1];

      learnWord(converted);
      learnBigram(prev, converted);

      document.execCommand("insertText", false, " ");
      resetState();
      setTimeout(() => showSuggestions(predictNextWord()), 0);
      return;
    }

    if (e.inputType === "insertParagraph") {
      e.preventDefault();
      if (isMathMode) {
        mathBuffer = "";
      }
      if (!isEnglishMode && englishBuffer) {
        const converted = engine.transliterateWord(englishBuffer);
        if (converted) replaceWord(converted);
      }
      setBufferPreview("", "");

      const br = document.createElement("br");
      const textNode = document.createTextNode("\u200B");

      const range = window.getSelection().getRangeAt(0);
      range.insertNode(br);
      br.after(textNode);

      range.setStartAfter(textNode);
      range.collapse(true);

      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      resetState();
      showSuggestions([]);
      return;
    }

    if (e.inputType === "deleteContentBackward") {
      if (isMathMode) {
        if (mathBuffer.length > 0) {
          e.preventDefault();
          mathBuffer = mathBuffer.slice(0, -1);
          replaceWord(mathConvert(mathBuffer));
          setBufferPreview(mathBuffer, mathShorthand[mathBuffer] || mathShorthand[mathBuffer.toLowerCase()] || "");
        } else {
          // let browser delete normally if buffer empty
          setBufferPreview("", "");
        }
        return;
      }
      if (isEnglishMode) return;
      if (englishBuffer.length > 0) {
        e.preventDefault();
        englishBuffer = englishBuffer.slice(0, -1);
        const converted = engine.transliterateWord(englishBuffer);
        replaceWord(converted);
        setBufferPreview(englishBuffer, converted);
      } else {
        resetState();
        setBufferPreview("", "");
      }
      return;
    }

    if (e.inputType === "insertText" && /[0-9]/.test(e.data)) {
      if (isMathMode) {
        e.preventDefault();
        mathBuffer += e.data;
        replaceWord(mathConvert(mathBuffer));
        setBufferPreview(mathBuffer, "");
        return;
      }
      if (isEnglishMode) return;
      const mapped = engine?.mapDigit?.(e.data);
      if (!mapped) return;
      e.preventDefault();
      document.execCommand("insertText", false, mapped);
      return;
    }

    if (e.inputType === "insertText" && e.data === "|") {
      if (isMathMode) return;
      if (isEnglishMode) return;
      const mapped = engine?.mapPunctuation?.("|");
      if (!mapped) return;
      e.preventDefault();
      document.execCommand("insertText", false, mapped);
      return;
    }

    // Math operators and shorthand punctuation
    if (isMathMode && e.inputType === "insertText" && typeof e.data === "string") {
      const ch = e.data;
      const allowed = /^(\^|\*|\/|\+|\-|\(|\)|=|<|>|,|\.)$/;
      if (allowed.test(ch)) {
        e.preventDefault();
        mathBuffer += ch;
        replaceWord(mathConvert(mathBuffer));
        setBufferPreview(mathBuffer, "");
        return;
      }
    }
  });

/* ========================= TAB SUPPORT ========================= */
  output.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      const engine = activeLang?.engine;
      if (!engine?.transliterateWord || activeLangId === "en") return;

      const converted = engine.transliterateWord(englishBuffer);
      const suggestions = getSuggestions(converted);

      if (suggestions.length) {
        e.preventDefault();
        insertSuggestion(suggestions[0]);
      }
    }
  });

/* ========================= RESET ========================= */
  output.addEventListener("mouseup", () => {
    resetState();
    showSuggestions([]);
  });

  output.addEventListener("keyup", (e) => {
    if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
      resetState();
      showSuggestions([]);
    }
  });

  output.addEventListener("input", () => {
    if (output.innerText.trim() === "") {
      resetState();
    }
  });

  initLanguageSelect();
  initEmojiPicker();
  initMathPicker();
  initExportMenu();
});