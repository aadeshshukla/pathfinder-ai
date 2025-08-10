// src/PathfinderMVP.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import StepFour from './components/StepFour';
import StepFive from './components/StepFive';
import StepSix from './components/stepSix';
import ProgressBar from './components/progressBar';

import './components/PathfinderMVP.css';
import './components/StepBase.css';
import { supabase } from './supabase';
import { buildGraph, topologicalSort } from './utils/graphUtils';

export default function PathfinderMVP() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [context, setContext] = useState({ level: '', time: '', preference: '' });
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // Fetch nodes & edges
  const fetchGraphData = async () => {
    const { data: nodeData, error: nodeError } = await supabase.from('nodes').select('*');
    if (nodeError) console.error('fetch nodes error:', nodeError);
    else setNodes(nodeData || []);

    const { data: edgeData, error: edgeError } = await supabase.from('edges').select('*');
    if (edgeError) console.error('fetch edges error:', edgeError);
    else setEdges(edgeData || []);
  };

  useEffect(() => { fetchGraphData(); }, []);

  // addNode
  const addNode = async (payload) => {
    const { error } = await supabase.from('nodes').insert([payload]);
    if (error) { console.error('addNode error:', error); return false; }
    await fetchGraphData();
    return true;
  };

  // addEdge
  const addEdge = async (fromNodeId, toNodeId, relationship = 'prerequisite') => {
    if (!fromNodeId || !toNodeId) { alert('Select both'); return false; }
    const { error } = await supabase.from('edges').insert([{ from_node_id: fromNodeId, to_node_id: toNodeId, relationship_type: relationship }]);
    if (error) { console.error('addEdge error:', error); return false; }
    await fetchGraphData();
    return true;
  };

  // Build graph & topo sort
  const { graph, inDegree } = useMemo(() => buildGraph(nodes, edges), [nodes, edges]);
  const sortedNodes = useMemo(() => topologicalSort(nodes, graph, inDegree), [nodes, graph, inDegree]);

  const goNext = () => setStep((s) => Math.min(s + 1, 6));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="app-wrapper">
      <div className="app-header" style={{ width: '100%', maxWidth: 760 }}>
        <div style={{ fontWeight: 700 }}>Pathfinder AI</div>
        <div className="small-muted">MVP</div>
      </div>

      <ProgressBar step={step} totalSteps={6} />

      <AnimatePresence mode="wait">
        {step === 1 && <motion.div key="s1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}><StepOne goal={goal} setGoal={setGoal} onNext={goNext} /></motion.div>}
        {step === 2 && <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><StepTwo context={context} setContext={setContext} onNext={goNext} /></motion.div>}
        {step === 3 && <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><StepThree onNext={goNext} /></motion.div>}
        {step === 4 && <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><StepFour sortedNodes={sortedNodes} edges={edges} onNext={goNext} /></motion.div>}
        {step === 5 && <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><StepFive addNode={addNode} onNext={goNext} /></motion.div>}
        {step === 6 && <motion.div key="s6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><StepSix nodes={nodes} addEdge={addEdge} /></motion.div>}
      </AnimatePresence>

      {step > 1 && <div style={{ width: '100%', maxWidth: 760, textAlign: 'center' }}><button className="back-btn" onClick={goBack}>← Back</button></div>}
    </div>
  );
}
