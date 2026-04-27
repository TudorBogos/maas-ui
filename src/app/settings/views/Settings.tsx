import { useFetchActions } from "@/app/base/hooks";
import Routes from "@/app/settings/components/Routes";
import { configActions } from "@/app/store/config";

const Settings = (): React.ReactElement => {
  useFetchActions([configActions.fetch]);

  return <Routes />;
};

export default Settings;
