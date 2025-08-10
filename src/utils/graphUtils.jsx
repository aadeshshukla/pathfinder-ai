// src/utils/graphUtils.js
export function buildGraph(nodes = [], edges = []) {
  const graph = new Map();
  const inDegree = new Map();

  nodes.forEach((n) => {
    graph.set(n.id, []);
    inDegree.set(n.id, 0);
  });

  edges.forEach((e) => {
    const from = e.from_node_id;
    const to = e.to_node_id;
    if (!graph.has(from) || !graph.has(to)) return;
    graph.get(from).push(to);
    inDegree.set(to, (inDegree.get(to) || 0) + 1);
  });

  return { graph, inDegree };
}

export function topologicalSort(nodes = [], graph = new Map(), inDegree = new Map()) {
  const indeg = new Map(inDegree);
  const q = [];
  const sorted = [];

  for (const [id, deg] of indeg.entries()) {
    if (deg === 0) q.push(id);
  }

  while (q.length) {
    const cur = q.shift();
    const node = nodes.find((n) => n.id === cur);
    if (node) sorted.push(node);

    const nbrs = graph.get(cur) || [];
    for (const nb of nbrs) {
      indeg.set(nb, indeg.get(nb) - 1);
      if (indeg.get(nb) === 0) q.push(nb);
    }
  }

  return sorted;
}

  