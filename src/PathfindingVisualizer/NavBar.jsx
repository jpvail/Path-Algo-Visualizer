import "./NavBar.css";
import DropdownMenu from "./DropdownMenu";
import { useState } from "react";

const NavBar = props => {
  const [algorithmSelected, setAlgorithmSelected] = useState(0);

  const algorithms = [
    "dummy",
    "Visualize Dijkstra's!",
    "Visualize Depth-First Search!",
    "Visualize Breadth-First Search!",
    "Visualize A*!"
  ];

  const {
    visualizeAlgorithm,
    onRestart,
    onClearBarriers,
    onClearVis,
    onAddCheckPoint,
    add
  } = props;

  const NavItem = props => {
    const [open, setOpen] = useState(false);
    return (
      <li className="nav-item">
        <a onClick={() => setOpen(!open)}>Algorithms</a>
        {open && props.children}
      </li>
    );
  };

  const handleDropdownSelect = algNumber => {
    setAlgorithmSelected(algNumber);
  };

  return (
    <div>
      <nav>
        <div className="logo">Path Algo Visualizer</div>
        <NavItem>
          <DropdownMenu handleDropdownSelect={handleDropdownSelect} />
        </NavItem>
        <button
          className="mainButton"
          onClick={() => visualizeAlgorithm(algorithmSelected)}
        >
          {(algorithmSelected && algorithms[algorithmSelected]) || (
            <>Choose An Algorithm!</>
          )}
        </button>
        <ul className="nav-links">
          <li onClick={onRestart}>
            <a>Restart</a>
          </li>
          <li onClick={onClearBarriers}>
            <a>Clear Barriers</a>
          </li>
          <li onClick={onClearVis}>
            <a>Clear Visualization</a>
          </li>
          <li onClick={onAddCheckPoint}>
            {(add && <a>Add Checkpoint</a>) || <a>Remove Checkpoint</a>}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
