import { createContext, useContext, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-function

type ScreenTransitioner = {
  transitionTo: (Screen: React.FC) => void;
};

const ScreenTransitionerContext = createContext<ScreenTransitioner | null>(
  null
);

export const useScreenTransitioner = (): ScreenTransitioner => {
  const context = useContext(ScreenTransitionerContext);
  if (!context) {
    throw new Error(
      "useScreenTransitioner can only be used within ScreenTransitionerProvider"
    );
  }
  return context;
};

export default function ScreenTransitionerProvider({
  initialScreen,
}: {
  initialScreen: React.FC;
}): JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<{ screen: React.FC }>({
    screen: initialScreen,
  });

  const transitionTo = (NextScreen: React.FC): void => {
    setCurrentScreen({ screen: NextScreen });
  };
  const Screen = currentScreen.screen;
  return (
    <ScreenTransitionerContext.Provider value={{ transitionTo }}>
      <Screen />
    </ScreenTransitionerContext.Provider>
  );
}
