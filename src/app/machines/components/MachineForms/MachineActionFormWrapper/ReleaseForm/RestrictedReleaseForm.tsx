import { useEffect } from "react";

import { Spinner, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import type { ReleaseFormValues } from "./ReleaseForm";
import RestrictedReleaseFormFields from "./ReleaseFormFields/RestrictedReleaseFormFields";

import ActionForm from "@/app/base/components/ActionForm";
import type { MachineActionFormProps } from "@/app/machines/types";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";
import { machineActions } from "@/app/store/machine";
import type { MachineEventErrors } from "@/app/store/machine/types";
import { useSelectedMachinesActionsDispatch } from "@/app/store/machine/utils/hooks";
import { NodeActions } from "@/app/store/types/node";

const RestrictedReleaseSchema = Yup.object().shape({
  enableErase: Yup.boolean(),
  quickErase: Yup.boolean(),
  secureErase: Yup.boolean(),
});

type Props = MachineActionFormProps;

export const RestrictedReleaseForm = ({
  clearSidePanelContent,
  errors,
  machines,
  processingCount,
  searchFilter,
  selectedCount,
  selectedMachines,
  viewingDetails,
}: Props): React.ReactElement => {
  const dispatch = useDispatch();
  const { dispatch: dispatchForSelectedMachines, ...actionProps } =
    useSelectedMachinesActionsDispatch({ selectedMachines, searchFilter });
  const configLoaded = useSelector(configSelectors.loaded);
  const enableErase = useSelector(configSelectors.enableDiskErasing);

  useEffect(() => {
    dispatch(configActions.fetch());

    return () => {
      dispatch(machineActions.cleanup());
    };
  }, [dispatch]);

  return configLoaded ? (
    <ActionForm<ReleaseFormValues, MachineEventErrors>
      actionName={NodeActions.RELEASE}
      allowAllEmpty
      cleanup={machineActions.cleanup}
      errors={errors}
      initialValues={{
        enableErase: enableErase || false,
        quickErase: enableErase || false,
        secureErase: false,
      }}
      modelName="machine"
      onCancel={clearSidePanelContent}
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Release machine",
      }}
      onSubmit={(values) => {
        dispatch(machineActions.cleanup());
        const { enableErase } = values;
        if (selectedMachines) {
          dispatchForSelectedMachines(machineActions.release, {
            erase: enableErase,
            quick_erase: enableErase,
            secure_erase: false,
          });
        } else {
          machines?.forEach((machine) => {
            dispatch(
              machineActions.release({
                erase: enableErase,
                quick_erase: enableErase,
                secure_erase: false,
                system_id: machine.system_id,
              })
            );
          });
        }
      }}
      onSuccess={clearSidePanelContent}
      processingCount={processingCount}
      selectedCount={machines ? machines.length : (selectedCount ?? 0)}
      validationSchema={RestrictedReleaseSchema}
      {...actionProps}
    >
      <Strip shallow>
        <RestrictedReleaseFormFields />
      </Strip>
    </ActionForm>
  ) : (
    <Spinner text="Loading..." />
  );
};

export default RestrictedReleaseForm;
