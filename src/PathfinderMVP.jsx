import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import StepFour from './components/StepFour';
import StepFive from './components/StepFive';
import StepSix from './components/StepSix';
import ProgressBar from './components/ProgressBar';

import './components/PathfinderMVP.css';
import { supabase } from './supabase';

export default function PathfinderMVP() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [timePerWeek, setTimePerWeek] = useState('');
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // Fetch nodes & edges together
  const fetchGraphData = async () => {
    // Nodes
    const { data: nodeData, error: nodeError } = await supabase
      .from('nodes')
      .select('*')
      .order('title', { ascending: true });

    if (nodeError) console.error('fetch nodes error:', nodeError);
    else setNodes(nodeData || []);

    // Edges
    const { data: edgeData, error: edgeError } = await supabase
      .from('edges')
      .select('*');

    if (edgeError) console.error('fetch edges error:', edgeError);
    else setEdges(edgeData || []);
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  // Add Node
  const addNode = async (payload) => {
    const { error } = await supabase.from('nodes').insert([payload]);
    if (error) {
      console.error('addNode error:', error);
      alert('Failed to add node');
      return false;
    }
    await fetchGraphData();
    return true;
  };

  // Add Edge
  const addEdge = async (fromNodeId, toNodeId, relationship = 'prerequisite') => {
    if (!fromNodeId || !toNodeId) {
      alert('Please select both nodes.');
      return false;
    }
    if (fromNodeId === toNodeId) {
      alert('From and To must be different.');
      return false;
    }
    const { error } = await supabase.from('edges').insert([
      { from_node_id: fromNodeId, to_node_id: toNodeId, relationship_type: relationship }
    ]);
    if (error) {
      console.error('addEdge error:', error);
      alert('Failed to add edge');
      return false;
    }
    await fetchGraphData();
    alert('Edge added!');
    return true;
  };

  const goNext = () => setStep((s) => Math.min(s + 1, 6));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="app-wrapper">
      <ProgressBar step={step} totalSteps={6} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <StepOne goal={goal} setGoal={setGoal} onNext={() => setStep(2)} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StepTwo
              skillLevel={skillLevel}
              setSkillLevel={setSkillLevel}
              timePerWeek={timePerWeek}
              setTimePerWeek={setTimePerWeek}
              onNext={() => setStep(3)}
            />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StepThree onNext={() => setStep(4)} />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StepFour nodes={nodes} edges={edges} onNext={() => setStep(5)} />
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StepFive
              addNode={async (title, description, link = '', focus_area = '', estimated_time = '', type = '') => {
                const ok = await addNode({ title, description, link, focus_area, estimated_time, type });
                if (ok) setStep(5);
                return ok;
              }}
              onNext={() => setStep(6)}
            />
          </motion.div>
        )}

        {step === 6 && (
          <motion.div key="step6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StepSix nodes={nodes} addEdge={addEdge} />
          </motion.div>
        )}
      </AnimatePresence>

      {step > 1 && (
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button className="back-btn" onClick={goBack}>
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
