import "./App.css";
import ScreenTransitionerProvider from "./Providers/TransitionProvider";
import ConfigProvider from "./Providers/ConfigProvider";
import CreateOrJoin from "./components/CreateOrJoin";
import { getItem } from "./utils";
import DJScreen from "./components/DJScreen.tsx";

function App() {
  const isRecording = getItem("recording-status", "none") === "recording";

  return (
    <ConfigProvider>
      <div className="flex-row align-center justify-center full-height full-width">
        <section className="main flex-column">
          <header className="main-header flex-row align-center justify-center">
            <h3 className="main-header__title">Kacheri</h3>
          </header>
          <section className="main-body">
            <ScreenTransitionerProvider
              initialScreen={isRecording ? DJScreen : CreateOrJoin}
            />
          </section>
          <footer className="main-footer flex-row align-center justify-center">
            <p>&copy; sknk</p>
          </footer>
        </section>
      </div>
    </ConfigProvider>
  );
}

export default App;
