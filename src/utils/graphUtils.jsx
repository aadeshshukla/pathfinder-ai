export function buildGraph(nodes, edges) {
    const graph = new Map();
    const inDegree = new Map();
  
    nodes.forEach((node) => {
      graph.set(node.id, []);
      inDegree.set(node.id, 0);
    });
  
    edges.forEach(({ from_node_id, to_node_id }) => {
      graph.get(from_node_id).push(to_node_id);
      inDegree.set(to_node_id, inDegree.get(to_node_id) + 1);
    });
  
    return { graph, inDegree };
  }
  
  export function topologicalSort(nodes, graph, inDegree) {
    const queue = [];
    const sorted = [];
  
    for (const [id, degree] of inDegree.entries()) {
      if (degree === 0) queue.push(id);
    }
  
    while (queue.length) {
      const current = queue.shift();
      const node = nodes.find(n => n.id === current);
      if (node) sorted.push(node);
  
      for (const neighbor of graph.get(current)) {
        inDegree.set(neighbor, inDegree.get(neighbor) - 1);
        if (inDegree.get(neighbor) === 0) queue.push(neighbor);
      }
    }
  
    return sorted;
  }
  