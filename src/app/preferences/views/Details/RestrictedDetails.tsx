import type { ReactElement } from "react";

import type { GetMeWithSummaryResponse } from "@/app/apiclient";

export enum Label {
  Email = "Email address",
  NoEmail = "No email",
  Username = "Username",
}

type Props = {
  user: GetMeWithSummaryResponse;
};

const RestrictedDetails = ({ user }: Props): ReactElement => {
  return (
    <dl>
      <dt>{Label.Username}</dt>
      <dd>{user.username}</dd>
      <dt>{Label.Email}</dt>
      <dd>{user.email || Label.NoEmail}</dd>
    </dl>
  );
};

export default RestrictedDetails;
