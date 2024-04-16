import ComponentSlider from "./ComponentSlider";
import CreateOrJoin from "./CreateOrJoin";
import Party from "./Party";

export const SlidingLeftCreateOrJoin = () => (
  <ComponentSlider direction="left">
    <CreateOrJoin />
  </ComponentSlider>
);

export const SlidingLeftParty = () => (
  <ComponentSlider direction="left">
    <Party />
  </ComponentSlider>
);
