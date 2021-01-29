import "./App.css";
import PathfindingVisualizer from "./PathfindingVisualizer/PathfindingVisualizer.jsx";
import {
  Breakpoint,
  BreakpointProvider,
  setDefaultBreakpoints
} from "react-socks";

//screen sizes for responsivness
setDefaultBreakpoints([{ small: 576 }, { medium: 768 }, { large: 1250 }]);

function App() {
  return (
    <div className="App">
      <BreakpointProvider>
        <PathfindingVisualizer />
      </BreakpointProvider>
    </div>
  );
}

export default App;
