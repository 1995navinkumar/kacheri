import "./App.css";
import ScreenTransitionerProvider from "./Providers/TransitionProvider";
import ConfigProvider from "./Providers/ConfigProvider";
import CreateOrJoin from "./components/CreateOrJoin";
import DJScreen from "./components/DJScreen.tsx";
import GlobalStateProvider, {
  useGlobalState,
} from "./Providers/GlobalStateProvider";

function App() {
  return (
    <ConfigProvider>
      <GlobalStateProvider>
        <div
          className="flex-row align-center justify-center full-height full-width"
          style={{ background: "black", padding: "8px" }}
        >
          <section className="main flex-column">
            <header className="main-header flex-row align-center justify-center">
              <p className="main-header__title">&copy; sknk</p>
            </header>
            <section className="main-body">
              <Main />
            </section>
            {/* <footer className="main-footer flex-row align-center justify-center">
              <p>&copy; sknk</p>
            </footer> */}
          </section>
        </div>
      </GlobalStateProvider>
    </ConfigProvider>
  );
}

function Main(): JSX.Element {
  const { state } = useGlobalState();
  const { app } = state;
  return (
    <ScreenTransitionerProvider
      initialScreen={app.isRecording ? DJScreen : CreateOrJoin}
    />
  );
}

export default App;
