import type { ReactNode } from "react";

import { useSelector } from "react-redux";

import TableCheckbox from "@/app/machines/components/TableCheckbox";
import { Checked } from "@/app/machines/components/TableCheckbox/TableCheckbox";
import machineSelectors from "@/app/store/machine/selectors";
import type { Machine, MachineMeta } from "@/app/store/machine/types";

type Props = {
  callId?: string | null;
  label: ReactNode;
  systemId: Machine[MachineMeta.PK];
};

const RestrictedMachineCheckbox = ({
  callId,
  label,
  systemId,
}: Props): React.ReactElement => {
  const selected = useSelector(machineSelectors.selected);
  const isChecked =
    !!selected && "items" in selected && !!selected.items?.includes(systemId);

  return (
    <TableCheckbox
      callId={callId}
      inputLabel={label}
      isChecked={isChecked ? Checked.Checked : Checked.Unchecked}
      onGenerateSelected={(checked) => (checked ? { items: [systemId] } : null)}
    />
  );
};

export default RestrictedMachineCheckbox;
