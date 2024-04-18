import { useEffect, ReactNode } from "react";
import { createContext, useContext } from "react";
import { getItem, setItem, uuid } from "../utils";

export type Config = {
  clientId: string;
};

const ConfigContext = createContext<Config | null>(null);

const CLIENT_ID = "CLIENT_ID";

export const useConfig = (): Config => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("Wrap config provider");
  }
  return context;
};

export default function ConfigProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const clientId = getItem(CLIENT_ID, uuid().toString());
  useEffect(() => {
    setItem(CLIENT_ID, clientId);
  }, []);

  return (
    <ConfigContext.Provider value={{ clientId }}>
      {children}
    </ConfigContext.Provider>
  );
}
