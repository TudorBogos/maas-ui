import type { ReactElement } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Col, Notification, Row, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { useGetCurrentUser } from "@/app/api/query/auth";
import { useWindowTitle } from "@/app/base/hooks";
import { EditUser } from "@/app/settings/views/Users/components";
import statusSelectors from "@/app/store/status/selectors";

export enum Label {
  Email = "Email address",
  NoEmail = "No email",
  Title = "Details",
  Username = "Username",
}

export const Details = (): ReactElement => {
  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);

  const user = useGetCurrentUser();

  useWindowTitle(Label.Title);

  return (
    <ContentSection aria-label={Label.Title}>
      <ContentSection.Title>{Label.Title}</ContentSection.Title>
      <ContentSection.Content>
        {externalAuthURL && (
          <Notification severity="information">
            Users for this MAAS are managed using an external service
          </Notification>
        )}
        <Row>
          <Col size={6}>
            {user.isPending && <Spinner text="Loading..." />}
            {user.isSuccess && user.data?.is_superuser === true && (
              <EditUser id={user.data.id} isSelfEditing={true} />
            )}
            {user.isSuccess && user.data?.is_superuser === false && (
              <dl>
                <dt>{Label.Username}</dt>
                <dd>{user.data.username}</dd>
                <dt>{Label.Email}</dt>
                <dd>{user.data.email || Label.NoEmail}</dd>
              </dl>
            )}
          </Col>
        </Row>
      </ContentSection.Content>
    </ContentSection>
  );
};

export default Details;
