import { useEffect, useState, useRef } from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import {
  dijkstra,
  dfs,
  bfs,
  aStar,
  getNodesInShortestPathOrder
} from "../algorithms/algorithms";
import NavBar from "./NavBar.jsx";
import { BreakpointProvider, Breakpoint } from "react-socks";

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const visualizerOnBoard = useRef(false);
  const visualizerIsRunning = useRef(false);
  const mouseDownRef = useRef(false);
  const startNodeMovingRef = useRef(false);
  const finishNodeMovingRef = useRef(false);
  const startNodePosRef = useRef([10, 15]);
  const finishNodePosRef = useRef([10, 35]);
  const checkPointOnBoard = useRef(false);
  const checkPointPosRef = useRef([5, 25]);
  const checkPointMovingRef = useRef(false);
  const addCheckPointOnNav = useRef(true);

  useEffect(() => {
    const newGrid = getGrid(true, false);
    setGrid(newGrid);
  }, []);

  const algorithms = [0, dijkstra, dfs, bfs, aStar];

  /*
  - we need deep copy to prevent corrupting state
  - called for any algorithm 
  */
  const animateAlgorithm = (
    visitedNodesInOrder,
    nodesFromStartToCheckPoint
  ) => {
    for (let i = 0; i <= visitedNodesInOrder.length; ++i) {
      if (i === visitedNodesInOrder.length) {
        let nodesInShortestPathOrder;
        if (
          //there is no path from startNode to finishNode
          visitedNodesInOrder[i - 1].row !== finishNodePosRef.current[0] ||
          visitedNodesInOrder[i - 1].col !== finishNodePosRef.current[1]
        ) {
          visualizerIsRunning.current = false;
          return;
        }
        setTimeout(() => {
          console.log(visitedNodesInOrder[i - 1]);
          nodesInShortestPathOrder = getNodesInShortestPathOrder(
            visitedNodesInOrder[i - 1]
          );
          if (checkPointOnBoard.current) {
            nodesInShortestPathOrder.unshift();
            nodesInShortestPathOrder = [
              ...getNodesInShortestPathOrder(
                nodesFromStartToCheckPoint[checkPointPosRef.current[0]][
                  checkPointPosRef.current[1]
                ]
              ),
              ...nodesInShortestPathOrder
            ];
          }
          for (let j = 0; j <= nodesInShortestPathOrder.length; ++j) {
            if (j === nodesInShortestPathOrder.length) {
              setTimeout(() => {
                visualizerIsRunning.current = false;
              }, j * 10);
              return;
            }
            setTimeout(() => {
              setGrid(grid => {
                const node = nodesInShortestPathOrder[j];
                const gridCopy = [];
                for (const row of grid) {
                  const rowCopy = [];
                  for (const node of row) {
                    rowCopy.push({ ...node });
                  }
                  gridCopy.push(rowCopy);
                }
                gridCopy[node.row][node.col] = node;
                return gridCopy;
              });
            }, j * 10); //note: j*10 is j*10 milliseconds from when the scheduled enclosing function STARTS executing
          }
        }, i * 10);
        return;
      }

      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        setGrid(grid => {
          const gridCopy = [];
          for (const row of grid) {
            const rowCopy = [];
            for (const node of row) {
              rowCopy.push({ ...node });
            }
            gridCopy.push(rowCopy);
          }
          gridCopy[node.row][node.col] = node;
          return gridCopy;
        });
      }, i * 10);
    }
  };

  const visualizeAlgorithm = algNumber => {
    if (!algNumber) return; //no alg selected
    if (visualizerOnBoard.current) return; //visualization has not been cleared
    visualizerIsRunning.current = true;
    visualizerOnBoard.current = true;
    let gridCopy = [];
    for (const row of grid) {
      const rowCopy = [];
      for (const node of row) {
        rowCopy.push({ ...node });
      }
      gridCopy.push(rowCopy);
    }
    let visitedNodesInOrder;
    let startNode =
      gridCopy[startNodePosRef.current[0]][startNodePosRef.current[1]];
    let nodesFromStartToCheckPoint; //used only for checkpoints
    if (checkPointOnBoard.current) {
      //how to handle checkpoint
      let finishNode =
        gridCopy[checkPointPosRef.current[0]][checkPointPosRef.current[1]];
      visitedNodesInOrder = algorithms[algNumber](
        gridCopy,
        startNode,
        finishNode
      );
      //dijkstra(gridCopy, startNode, finishNode);
      nodesFromStartToCheckPoint = gridCopy;
      visitedNodesInOrder.pop();
      gridCopy = [];
      for (const row of grid) {
        const rowCopy = [];
        for (const node of row) {
          rowCopy.push({ ...node });
        }
        gridCopy.push(rowCopy);
      }
      startNode =
        gridCopy[checkPointPosRef.current[0]][checkPointPosRef.current[1]];
      finishNode =
        gridCopy[finishNodePosRef.current[0]][finishNodePosRef.current[1]];
      visitedNodesInOrder = [
        ...visitedNodesInOrder,
        ...algorithms[algNumber](gridCopy, startNode, finishNode)
      ];
    } else {
      const finishNode =
        gridCopy[finishNodePosRef.current[0]][finishNodePosRef.current[1]];
      visitedNodesInOrder = algorithms[algNumber](
        gridCopy,
        startNode,
        finishNode
      );
    }
    animateAlgorithm(visitedNodesInOrder, nodesFromStartToCheckPoint);
  };

  const getNewGridWithWallToggled = (row, col) => {
    const gridCopy = [];
    for (const row of grid) {
      const rowCopy = [];
      for (const node of row) {
        rowCopy.push({ ...node });
      }
      gridCopy.push(rowCopy);
    }
    const node = gridCopy[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall
    };
    gridCopy[row][col] = newNode;
    return gridCopy;
  };

  //isFresh - true if grid should be created with nodes with default ('fresh') properties
  const getGrid = (isFresh, withCheckPoint) => {
    const newGrid = [];
    for (let row = 0; row < 15; ++row) {
      const currentRow = [];
      for (let col = 0; col < 50; ++col) {
        currentRow.push(createNode(col, row, isFresh, withCheckPoint));
      }
      newGrid.push(currentRow);
    }
    return newGrid;
  };

  const createNode = (col, row, isFresh, withCheckPoint) => {
    return {
      col,
      isStart:
        row === startNodePosRef.current[0] &&
        col === startNodePosRef.current[1],
      isFinish:
        row === finishNodePosRef.current[0] &&
        col === finishNodePosRef.current[1],
      inShortestPath: false,
      distance: Infinity,
      isVisited: false,
      isWall: isFresh
        ? false
        : row === startNodePosRef.current[0] &&
          col === startNodePosRef.current[1]
        ? false
        : row === finishNodePosRef.current[0] &&
          col === finishNodePosRef.current[1]
        ? false
        : row === checkPointPosRef.current[0] &&
          col === checkPointPosRef.current[1]
        ? false
        : grid.length > 0
        ? grid[row][col].isWall
        : false,
      previousNode: null,
      isCheckPoint: !withCheckPoint
        ? false
        : row === checkPointPosRef.current[0] &&
          col === checkPointPosRef.current[1]
        ? true
        : false,
      fScore: Infinity,
      row
    };
  };

  //Event Handlers

  const handleMouseDown = (row, col) => {
    if (visualizerOnBoard.current) return;
    mouseDownRef.current = true;
    if (
      row === checkPointPosRef.current[0] &&
      col === checkPointPosRef.current[1]
    ) {
      checkPointMovingRef.current = true;
      return;
    }
    if (
      row === startNodePosRef.current[0] &&
      col === startNodePosRef.current[1]
    ) {
      startNodeMovingRef.current = true;
      return;
    }
    if (
      row === finishNodePosRef.current[0] &&
      col === finishNodePosRef.current[1]
    ) {
      finishNodeMovingRef.current = true;
      return;
    }
    setGrid(getNewGridWithWallToggled(row, col));
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseDownRef.current) return;
    if (checkPointMovingRef.current) {
      checkPointPosRef.current = [row, col];
      const newGrid = getGrid(false, checkPointOnBoard.current);
      setGrid(newGrid);
      return;
    }
    if (startNodeMovingRef.current) {
      startNodePosRef.current = [row, col];
      const newGrid = getGrid(false, checkPointOnBoard.current);
      setGrid(newGrid);
      return;
    }
    if (finishNodeMovingRef.current) {
      finishNodePosRef.current = [row, col];
      const newGrid = getGrid(false, checkPointOnBoard.current);
      setGrid(newGrid);
      return;
    }
    if (
      (row !== startNodePosRef.current[0] ||
        col !== startNodePosRef.current[1]) &&
      (row !== finishNodePosRef.current[0] ||
        col !== finishNodePosRef.current[1]) &&
      (row !== checkPointPosRef.current[0] ||
        col !== checkPointPosRef.current[1])
    )
      setGrid(getNewGridWithWallToggled(row, col));
  };

  const handleMouseUp = () => {
    finishNodeMovingRef.current = false;
    startNodeMovingRef.current = false;
    checkPointMovingRef.current = false;
    mouseDownRef.current = false;
  };

  const handleRestart = () => {
    if (visualizerIsRunning.current) return;
    visualizerOnBoard.current = false;
    checkPointOnBoard.current = false;
    addCheckPointOnNav.current = true;
    //restarts start and finish nodes
    startNodePosRef.current = [10, 15];
    finishNodePosRef.current = [10, 35];
    setGrid(getGrid(true, checkPointOnBoard.current));
  };

  const handleClearVisualization = () => {
    if (visualizerIsRunning.current) return;
    visualizerOnBoard.current = false;
    setGrid(getGrid(false, checkPointOnBoard.current));
  };

  const handleClearBarriers = () => {
    if (visualizerOnBoard.current) return;
    setGrid(getGrid(true, checkPointOnBoard.current));
  };

  const handleAddCheckPoint = () => {
    if (visualizerOnBoard.current) return;
    checkPointOnBoard.current = !checkPointOnBoard.current;
    addCheckPointOnNav.current = !addCheckPointOnNav.current;
    setGrid(getGrid(false, checkPointOnBoard.current));
  };

  return (
    <>
      <NavBar
        visualizeAlgorithm={visualizeAlgorithm}
        onClearVis={handleClearVisualization}
        onRestart={handleRestart}
        onClearBarriers={handleClearBarriers}
        onAddCheckPoint={handleAddCheckPoint}
        add={addCheckPointOnNav.current}
      />

      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const {
                  row,
                  isStart,
                  isFinish,
                  inShortestPath,
                  isVisited,
                  isWall,
                  isCheckPoint,
                  col
                } = node;
                return (
                  <Node
                    col={col}
                    key={nodeIdx}
                    isFinish={isFinish}
                    isStart={isStart}
                    inShortestPath={inShortestPath}
                    isVisited={isVisited}
                    isWall={isWall}
                    isCheckPoint={isCheckPoint}
                    onMouseUp={handleMouseUp}
                    onMouseDown={handleMouseDown}
                    onMouseEnter={handleMouseEnter}
                    row={row}
                  ></Node>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="credit">By Jason Vail</div>
    </>
  );
};

export default PathfindingVisualizer;
