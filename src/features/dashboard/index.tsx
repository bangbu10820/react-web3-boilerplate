import { FormattedMessage } from "react-intl";
import { ThemeSwitch } from "@/components/theme-switch";
import { Header } from "@/components/header";
import { TypographyH1 } from "@/components/typography";
import { Search } from "@/components/search";
import { ConnectWalletButton } from "@/components/connect-wallet-button";

export default function Dashboard() {
  return (
    <>
      <Header>
        {/* <TopNav links={topNav} /> */}
        <TypographyH1>
          <FormattedMessage id="app_title" />
        </TypographyH1>
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ConnectWalletButton />
          <ThemeSwitch />
          {/* <ProfileDropdown /> */}
        </div>
      </Header>
      {/* <SiteHeader /> */}
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} /> */}
          </div>
        </div>
      </div>
    </>
  );
}
