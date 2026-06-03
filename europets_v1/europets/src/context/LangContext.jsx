import { createContext, useContext, useState, useCallback } from "react";
import vi from "../locales/vi";
import en from "../locales/en";

// ── Locale registry — thêm ngôn ngữ mới chỉ cần thêm vào đây ──
const LOCALES = { vi, en };

export const LANG_OPTIONS = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", label: "English",    flag: "🇺🇸" },
];

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("ep_lang") || "vi"; } catch { return "vi"; }
  });

  const switchLang = useCallback((code) => {
    if (!LOCALES[code]) return;
    setLang(code);
    try { localStorage.setItem("ep_lang", code); } catch {}
  }, []);

  const t = LOCALES[lang] || LOCALES.vi;

  return (
    <LangContext.Provider value={{ lang, switchLang, t, LANG_OPTIONS }}>
      {children}
    </LangContext.Provider>
  );
}

/** Hook tiện dụng: const { t, lang, switchLang } = useLang(); */
export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}
