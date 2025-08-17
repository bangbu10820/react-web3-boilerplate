import type { FC, PropsWithChildren } from "react";

const TypographyH1: FC<PropsWithChildren> = ({ children }) => {
  return <h1 className="text-2xl font-bold">{children}</h1>;
};
TypographyH1.displayName = "TypographyH1";

const TypographyH2: FC<PropsWithChildren> = ({ children }) => {
  return <h2 className="text-xl font-bold">{children}</h2>;
};
TypographyH2.displayName = "TypographyH2";

const TypographyH3: FC<PropsWithChildren> = ({ children }) => {
  return <h3 className="text-lg font-bold">{children}</h3>;
};
TypographyH3.displayName = "TypographyH3";

const TypographyH4: FC<PropsWithChildren> = ({ children }) => {
  return <h4 className="text-base font-bold">{children}</h4>;
};
TypographyH4.displayName = "TypographyH4";

export { TypographyH1, TypographyH2, TypographyH3, TypographyH4 };
