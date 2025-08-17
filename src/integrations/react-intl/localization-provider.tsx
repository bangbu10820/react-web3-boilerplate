import React, { createContext, useContext, useState } from "react";
import { IntlProvider } from "react-intl";
import English from "./locales/en.json";
import Vietnamese from "./locales/vi.json";

const messages: Record<string, Record<string, string>> = {
  "en-US": English,
  "vi-VN": Vietnamese,
};

type Locale = "en-US" | "vi-VN";
const initialLocale: Locale = "en-US";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocalizationProvider");
  }
  return context;
};

export const LocalizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <IntlProvider
        messages={messages[locale]}
        locale={locale}
        defaultLocale={initialLocale}
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};
