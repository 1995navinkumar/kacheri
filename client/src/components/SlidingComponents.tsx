import ComponentSlider from "./ComponentSlider";
import CreateOrJoin from "./CreateOrJoin";
import DJScreen from "./DJScreen.tsx";
import RasigarScreen from "./RasigarScreen";

export const SlidingRightCreateOrJoin = () => (
  <ComponentSlider direction="left">
    <CreateOrJoin />
  </ComponentSlider>
);

export const SlidingLeftRasigarScreen = () => (
  <ComponentSlider direction="left">
    <RasigarScreen />
  </ComponentSlider>
);

export const SlidingLeftDJScreen = () => (
  <ComponentSlider direction="left">
    <DJScreen />
  </ComponentSlider>
);
