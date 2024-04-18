import { useConfig } from "../../Providers/ConfigProvider";

export default function DJScreen(): JSX.Element {
  const { clientId } = useConfig();

  return (
    <div className="flex-column" style={{ gap: "48px" }}>
      <p className="create-description">Waiting for Rasigars</p>
    </div>
  );
}
