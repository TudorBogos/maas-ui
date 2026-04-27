import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { useSelector } from "react-redux";

import configSelectors from "@/app/store/config/selectors";

export const DEFAULT_THEME = "cti";

export type ThemeContextType = {
  theme: string;
  setTheme: (c: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
});

export const useThemeContext = (): ThemeContextType => {
  const { theme, setTheme } = useContext(ThemeContext);
  return { theme, setTheme };
};

const ThemeContextProvider = ({
  children,
}: PropsWithChildren<object>): React.ReactElement => {
  const maasTheme = useSelector(configSelectors.theme);
  const [theme, setTheme] = useState(maasTheme ? maasTheme : DEFAULT_THEME);

  useEffect(() => {
    setTheme(maasTheme ? maasTheme : DEFAULT_THEME);
  }, [maasTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
