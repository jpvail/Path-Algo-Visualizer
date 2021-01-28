import "./Node.css";

const Node = props => {
  const {
    col,
    isFinish,
    isStart,
    isVisited,
    inShortestPath,
    isWall,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    isCheckPoint,
    row
  } = props;

  const extraClassName = isWall
    ? "node-wall"
    : inShortestPath
    ? "node-shortest-path"
    : isVisited
    ? "node-visited"
    : isStart
    ? "node-start"
    : isFinish
    ? "node-finish"
    : isCheckPoint
    ? "node-checkpoint"
    : "";

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
};

export default Node;
