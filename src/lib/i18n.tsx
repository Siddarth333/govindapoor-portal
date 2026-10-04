import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "te" | "hi";

const dict: Record<string, Record<Lang, string>> = {
  home: { en: "Home", te: "హోమ్", hi: "होम" },
  announcements: { en: "Announcements", te: "ప్రకటనలు", hi: "घोषणाएँ" },
  events: { en: "Events", te: "కార్యక్రమాలు", hi: "कार्यक्रम" },
  projects: { en: "Development", te: "అభివృద్ధి", hi: "विकास" },
  documents: { en: "Documents", te: "పత్రాలు", hi: "दस्तावेज़" },
  meetings: { en: "Gram Sabha", te: "గ్రామ సభ", hi: "ग्राम सभा" },
  gallery: { en: "Gallery", te: "గ్యాలరీ", hi: "गैलरी" },
  about: { en: "Village Profile", te: "గ్రామ ప్రొఫైల్", hi: "ग्राम प्रोफ़ाइल" },
  contact: { en: "Contact", te: "సంప్రదించండి", hi: "संपर्क" },
  admin: { en: "Admin", te: "నిర్వాహకుడు", hi: "प्रशासक" },
  search: { en: "Search records", te: "రికార్డులను వెతకండి", hi: "रिकॉर्ड खोजें" },
  sarpanchMessage: { en: "Message from the Sarpanch", te: "సర్పంచ్ సందేశం", hi: "सरपंच का संदेश" },
  latest: { en: "Latest Announcements", te: "తాజా ప్రకటనలు", hi: "नवीनतम घोषणाएँ" },
  upcoming: { en: "Upcoming Events", te: "రాబోయే కార్యక్రమాలు", hi: "आगामी कार्यक्रम" },
  viewAll: { en: "View all", te: "అన్నీ చూడండి", hi: "सभी देखें" },
  transparency: { en: "Transparency Dashboard", te: "పారదర్శకత డాష్‌బోర్డ్", hi: "पारदर्शिता डैशबोर्ड" },
  feedback: { en: "Citizen Feedback", te: "పౌరుల అభిప్రాయం", hi: "नागरिक प्रतिक्रिया" },
  population: { en: "Population", te: "జనాభా", hi: "जनसंख्या" },
  populationDetails: {
    en: "View full population records",
    te: "పూర్తి జనాభా వివరాలు చూడండి",
    hi: "पूरा जनसंख्या रिकॉर्ड देखें",
  },
  links: { en: "Useful Links", te: "ఉపయోగకర లింక్‌లు", hi: "उपयोगी लिंक" },
  sarpanchHistory: { en: "Sarpanch History", te: "సర్పంచ్ చరిత్ర", hi: "सरपंच इतिहास" },
  sarpanchDetails: { en: "Sarpanch details", te: "సర్పంచ్ వివరాలు", hi: "सरपंच विवरण" },
  commitment: {
    en: "Our commitment to the village",
    te: "గ్రామానికి మా నిబద్ధత",
    hi: "गाँव के प्रति हमारी प्रतिबद्धता",
  },
};

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    const stored = localStorage.getItem("gp-lang") as Lang | null;
    if (stored) setLang(stored);
  }, []);
  const set = (l: Lang) => {
    localStorage.setItem("gp-lang", l);
    setLang(l);
  };
  const t = (k: string) => dict[k]?.[lang] ?? dict[k]?.en ?? k;
  return <Ctx.Provider value={{ lang, setLang: set, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
