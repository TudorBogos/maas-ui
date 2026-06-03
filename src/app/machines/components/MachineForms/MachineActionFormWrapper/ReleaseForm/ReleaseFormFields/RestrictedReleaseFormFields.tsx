import { Col, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { ReleaseFormValues } from "../ReleaseForm";

import FormikField from "@/app/base/components/FormikField";
import { FormikFieldChangeError } from "@/app/base/components/FormikField/FormikField";

export const RestrictedReleaseFormFields = (): React.ReactElement => {
  const { handleChange, setFieldValue } = useFormikContext<ReleaseFormValues>();

  return (
    <Row>
      <Col size={12}>
        <FormikField
          label="Erase disks before releasing"
          name="enableErase"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e);
            setFieldValue("quickErase", e.target.checked).catch((reason) => {
              throw new FormikFieldChangeError(
                "quickErase",
                "setFieldValue",
                reason
              );
            });
            setFieldValue("secureErase", false).catch((reason) => {
              throw new FormikFieldChangeError(
                "secureErase",
                "setFieldValue",
                reason
              );
            });
          }}
          type="checkbox"
        />
      </Col>
    </Row>
  );
};

export default RestrictedReleaseFormFields;
