//dijkstra
export const dijkstra = (grid, startNode, finishNode) => {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    if (closestNode.isWall) continue;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighborsDijkstra(closestNode, grid);
  }
};

export const dfs = (grid, startNode, finishNode) => {
  const visitedNodesInOrder = [];
  startNode.isVisited = true;
  const stack = [];
  stack.push(startNode);
  while (stack.length > 0) {
    const node = stack.pop();
    visitedNodesInOrder.push(node);
    if (node.row === finishNode.row && node.col === finishNode.col)
      return visitedNodesInOrder;
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (let i = 0; i < unvisitedNeighbors.length; ++i) {
      if (unvisitedNeighbors[i].isWall) continue;
      unvisitedNeighbors[i].isVisited = true;
      unvisitedNeighbors[i].previousNode = node;
      stack.push(unvisitedNeighbors[i]);
    }
  }
  return visitedNodesInOrder;
};

export const bfs = (grid, startNode, finishNode) => {
  const visitedNodesInOrder = [];
  startNode.isVisited = true;
  const queue = [];
  queue.unshift(startNode);
  while (queue.length > 0) {
    const node = queue.pop();
    visitedNodesInOrder.push(node);
    if (node.row === finishNode.row && node.col === finishNode.col)
      return visitedNodesInOrder;
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (let i = 0; i < unvisitedNeighbors.length; ++i) {
      if (unvisitedNeighbors[i].isWall) continue;
      unvisitedNeighbors[i].isVisited = true;
      unvisitedNeighbors[i].previousNode = node;
      queue.unshift(unvisitedNeighbors[i]);
    }
  }
  return visitedNodesInOrder;
};

export const aStar = (grid, startNode, finishNode) => {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  startNode.fScore =
    Math.abs(finishNode.col - startNode.col) +
    Math.abs(finishNode.row - startNode.row);
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByFScore(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    if (closestNode.fScore === Infinity) return visitedNodesInOrder;
    if (closestNode.isWall) continue;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighborsAStar(closestNode, finishNode, grid);
  }
};

const sortNodesByFScore = unvisitedNodes => {
  unvisitedNodes.sort((a, b) => a.fScore - b.fScore);
};

const sortNodesByDistance = unvisitedNodes => {
  unvisitedNodes.sort((a, b) => a.distance - b.distance);
};

const updateUnvisitedNeighborsAStar = (node, finishNode, grid) => {
  const neighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of neighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.fScore =
      Math.abs(finishNode.col - neighbor.col) +
      Math.abs(finishNode.row - neighbor.row);
    neighbor.previousNode = node;
  }
};

const updateUnvisitedNeighborsDijkstra = (node, grid) => {
  const neighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of neighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
};

const getUnvisitedNeighbors = (node, grid) => {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
};

const getAllNodes = grid => {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
};

export const getNodesInShortestPathOrder = finishNode => {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    currentNode.inShortestPath = true;
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
};
