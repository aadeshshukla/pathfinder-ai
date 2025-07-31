import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function PathfinderMVP() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [context, setContext] = useState({ level: '', time: '', preference: '' });
  const [nodeData, setNodeData] = useState([]);
  const [edges, setEdges] = useState([]);
  const [newNode, setNewNode] = useState({
    title: '',
    description: '',
    link: '',
    focus_area: '',
    estimated_time: '',
    type: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: nodesData, error: nodesError } = await supabase.from('nodes').select('*');
      const { data: edgesData, error: edgesError } = await supabase.from('edges').select('*');

      if (nodesError) console.error("Node error:", nodesError);
      if (edgesError) console.error("Edge error:", edgesError);

      setNodeData(nodesData || []);
      setEdges(edgesData || []);
    };

    fetchData();
  }, []);

  function buildGraph(nodes, edges) {
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

  function topologicalSort(nodes, graph, inDegree) {
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

  const { graph, inDegree } = buildGraph(nodeData, edges);
  const sortedNodes = topologicalSort(nodeData, graph, inDegree);

  const handleAddNode = async () => {
    const { error } = await supabase.from('nodes').insert([newNode]);
    if (error) {
      alert('❌ Error adding node');
      console.error(error);
    } else {
      alert('✅ Resource added successfully!');
      setStep(4);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl space-y-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-800">🎯 What's your learning goal?</h2>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Become a Full Stack Developer"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
              <div className="text-right">
                <button
                  className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform duration-150 text-white px-5 py-2 rounded-xl shadow-md"
                  onClick={() => setStep(2)}
                >
                  Next →
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-800">🧠 Tell us about yourself</h2>
              <input className="w-full border p-3 rounded" placeholder="Your skill level"
                onChange={(e) => setContext({ ...context, level: e.target.value })} />
              <input className="w-full border p-3 rounded" placeholder="Time per week"
                onChange={(e) => setContext({ ...context, time: e.target.value })} />
              <input className="w-full border p-3 rounded" placeholder="Preferred content"
                onChange={(e) => setContext({ ...context, preference: e.target.value })} />
              <div className="text-right">
                <button className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform duration-150 text-white px-5 py-2 rounded-xl shadow-md"
                  onClick={() => setStep(3)}>
                  Generate Path →
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 text-center animate-pulse"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">⚙️ Mapping your journey...</h2>
              <p className="text-gray-600">Analyzing your inputs and curating resources...</p>
              <button
                className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                onClick={() => setStep(4)}
              >
                Show Path
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-800">📍 Your Learning Path: {goal}</h2>
              {sortedNodes.length === 0 ? (
                <p className="text-gray-500">No path found or missing dependencies.</p>
              ) : (
                sortedNodes.map((step, i) => (
                  <motion.div
                    key={i}
                    className="bg-white p-6 rounded-xl shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-blue-600 hover:underline"
                    >
                      Go to Resource ↗
                    </a>
                    <p className="text-sm text-gray-500 mt-1">⏱ {step.estimated_time}</p>
                  </motion.div>
                ))
              )}
              <button
                className="mt-4 bg-gray-800 hover:bg-black text-white px-6 py-2 rounded-lg"
                onClick={() => setStep(5)}
              >
                ➕ Add a new resource
              </button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="bg-white shadow-xl rounded-2xl p-8 space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-800">➕ Add New Resource</h2>
              <input className="w-full border p-3 rounded" placeholder="Title"
                onChange={(e) => setNewNode({ ...newNode, title: e.target.value })} />
              <input className="w-full border p-3 rounded" placeholder="Description"
                onChange={(e) => setNewNode({ ...newNode, description: e.target.value })} />
              <input className="w-full border p-3 rounded" placeholder="Link"
                onChange={(e) => setNewNode({ ...newNode, link: e.target.value })} />
              <input className="w-full border p-3 rounded" placeholder="Focus Area"
                onChange={(e) => setNewNode({ ...newNode, focus_area: e.target.value })} />
              <input className="w-full border p-3 rounded" placeholder="Estimated Time"
                onChange={(e) => setNewNode({ ...newNode, estimated_time: e.target.value })} />
              <input className="w-full border p-3 rounded" placeholder="Type (e.g. video, doc)"
                onChange={(e) => setNewNode({ ...newNode, type: e.target.value })} />
              <div className="text-right">
                <button
                  className="bg-green-600 hover:bg-green-700 active:scale-95 transition-transform duration-150 text-white px-6 py-2 rounded-lg"
                  onClick={handleAddNode}
                >
                  Add Resource
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}






