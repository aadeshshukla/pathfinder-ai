import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css'
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import StepFour from './components/StepFour';
import StepFive from './components/StepFive';
import StepSix from './components/StepSix';
import { buildGraph, topologicalSort } from './utils/graphUtils';

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
    <div className="app-wrapper">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.5 }}>
            <StepOne goal={goal} setGoal={setGoal} onNext={() => setStep(2)} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.5 }}>
            <StepTwo context={context} setContext={setContext} onNext={() => setStep(3)} />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <StepThree onNext={() => setStep(4)} />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <StepFour goal={goal} sortedNodes={sortedNodes} onAddNew={() => setStep(5)} />
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
            <StepFive newNode={newNode} setNewNode={setNewNode} onAdd={handleAddNode} />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={() => setStep(6)} style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                ➕ Add Relationship
              </button>
            </div>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div key="step6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
            <StepSix onBack={() => setStep(4)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



