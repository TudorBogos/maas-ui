import type { ReactNode } from "react";

import { useGetIsSuperUser } from "@/app/api/query/auth";
import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";

export enum Label {
  Permissions = "You do not have permission to view this page.",
}

type Props = {
  children: ReactNode;
};

export const SuperUserOnly = ({ children }: Props): React.ReactElement => {
  const isSuperUser = useGetIsSuperUser();

  if (!isSuperUser.data) {
    return (
      <PageContent
        header={<SectionHeader title={Label.Permissions} />}
        sidePanelContent={null}
        sidePanelTitle={null}
      />
    );
  }

  return <>{children}</>;
};

export default SuperUserOnly;
