import "./App.css";
import ScreenTransitionerProvider from "./Providers/TransitionProvider";
import ConfigProvider from "./Providers/ConfigProvider";
import CreateOrJoin from "./components/CreateOrJoin";

function App() {
  return (
    <ConfigProvider>
      <div className="flex-row align-center justify-center full-height full-width">
        <section className="main flex-column">
          <header className="main-header flex-row align-center justify-center">
            <h3 className="main-header__title">Kacheri</h3>
          </header>
          <section className="main-body">
            <ScreenTransitionerProvider initialScreen={CreateOrJoin} />
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
