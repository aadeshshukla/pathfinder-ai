// src/PathfinderMVP.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import StepFour from './components/StepFour';
import StepFive from './components/StepFive';
import StepSix from './components/StepSix'; // Corrected component name from stepSix to StepSix
import ProgressBar from './components/progressBar';

import './components/PathfinderMVP.css';
import './components/StepBase.css';

import { supabase } from './supabase';
import { buildGraph, topologicalSort } from './utils/graphUtils';

export default function PathfinderMVP() {
  // --- UI / flow state
  const [step, setStep] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false); // set true during admin testing
  const totalSteps = isAdmin ? 6 : 4;

  // --- user inputs / context
  const [goal, setGoal] = useState('');
  const [context, setContext] = useState({ level: 'Beginner', time: '5', preference: 'Balanced' });

  // --- graph data
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loadingGraph, setLoadingGraph] = useState(false);

  // --- NEW: State for AI-generated roadmap
  const [roadmapData, setRoadmapData] = useState(null);

  // ---------- Data fetching / mutations ----------
  const fetchGraphData = async () => {
    setLoadingGraph(true);
    try {
      const { data: nodeData, error: nodeError } = await supabase.from('nodes').select('*');
      if (nodeError) {
        console.error('fetch nodes error:', nodeError);
      } else {
        setNodes(nodeData || []);
      }

      const { data: edgeData, error: edgeError } = await supabase.from('edges').select('*');
      if (edgeError) {
        console.error('fetch edges error:', edgeError);
      } else {
        setEdges(edgeData || []);
      }
    } finally {
      setLoadingGraph(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // --- NEW: Handler for receiving the generated roadmap from StepThree
  const handleRoadmapGeneration = (data) => {
    setRoadmapData(data);
  };


  // Insert a new node (payload must match nodes table columns)
  const addNode = async (payload) => {
    try {
      const { error } = await supabase.from('nodes').insert([payload]);
      if (error) {
        console.error('addNode error:', error);
        alert('Failed to add resource');
        return false;
      }
      await fetchGraphData();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Insert a new edge (from_node_id, to_node_id required)
  const addEdge = async (fromNodeId, toNodeId, relationship = 'prerequisite') => {
    if (!fromNodeId || !toNodeId) {
      alert('Select both From and To nodes');
      return false;
    }
    if (fromNodeId === toNodeId) {
      alert('From and To must be different');
      return false;
    }
    try {
      const { error } = await supabase.from('edges').insert([
        { from_node_id: fromNodeId, to_node_id: toNodeId, relationship_type: relationship }
      ]);
      if (error) {
        console.error('addEdge error:', error);
        alert('Failed to add connection');
        return false;
      }
      await fetchGraphData();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Optional admin helpers (not used by UI unless you wire them)
  const deleteNode = async (nodeId) => {
    const { error } = await supabase.from('nodes').delete().eq('id', nodeId);
    if (error) console.error('deleteNode error:', error);
    await fetchGraphData();
  };

  const deleteEdge = async (edgeId) => {
    const { error } = await supabase.from('edges').delete().eq('id', edgeId);
    if (error) console.error('deleteEdge error:', error);
    await fetchGraphData();
  };

  // ---------- Graph & ordering ----------
  // buildGraph returns { graph, inDegree } given nodes & edges
  const { graph, inDegree } = useMemo(() => buildGraph(nodes, edges), [nodes, edges]);

  // topologicalSort(nodes, graph, inDegree) -> ordered array of node objects
  const sortedNodes = useMemo(() => topologicalSort(nodes, graph, inDegree), [nodes, graph, inDegree]);

  // ---------- Navigation ----------
  const goNext = () => {
    // if not admin, max step is 4
    setStep((s) => {
      const max = isAdmin ? 6 : 4;
      return s < max ? s + 1 : s;
    });
  };

  const goBack = () => {
    setStep((s) => (s > 1 ? s - 1 : s));
  };

  // motion props (consistent animation for steps)
  const motionProps = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.36 }
  };

  return (
    <div className="app-wrapper">
      {/* Header + admin toggle for development/testing */}
      <div className="app-header" style={{ width: '100%', maxWidth: 760 }}>
        <div style={{ fontWeight: 700 }}>Pathfinder AI</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span className="small-muted">MVP</span>
          {/* Admin toggle (dev only) */}
          <button
            onClick={() => setIsAdmin((v) => !v)}
            style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e6e9ef', background: isAdmin ? '#eef2ff' : '#fff' }}
            title="Toggle admin mode"
          >
            {isAdmin ? 'Admin' : 'User'}
          </button>
        </div>
      </div>

      {/* Progress bar (adapts to admin or user total steps) */}
      <ProgressBar step={step} totalSteps={isAdmin ? 6 : 4} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="s1" {...motionProps}>
            <StepOne goal={goal} setGoal={setGoal} onNext={() => setStep(2)} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" {...motionProps}>
            <StepTwo context={context} setContext={setContext} onNext={() => setStep(3)} onBack={goBack} />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" {...motionProps}>
            {/* UPDATED: Pass combined form data and handlers to StepThree */}
            <StepThree
              formData={{
                goal: goal,
                experience: context.level,
                timeCommitment: context.time,
                learningStyle: context.preference,
                access: 'Free', // Assuming free for now, can be added to form later
              }}
              onNext={goNext}
              onPrevious={goBack}
              onRoadmapGeneration={handleRoadmapGeneration}
            />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="s4" {...motionProps}>
             {/* UPDATED: Pass AI-generated roadmap data to StepFour */}
            <StepFour
              roadmapData={roadmapData}
              onPrevious={goBack}
              // The props below are kept in case you want to switch back
              // to showing the graph for admin users, for example.
              nodes={nodes}
              edges={edges}
              sortedNodes={sortedNodes}
              onNext={() => {
                if (isAdmin) setStep(5);
                else {
                  // final user flow — show a friendly message
                  alert('You have reached the end of this roadmap!');
                }
              }}
              onBack={goBack}
              loading={loadingGraph}
            />
          </motion.div>
        )}

        {isAdmin && step === 5 && (
          <motion.div key="s5" {...motionProps}>
            <StepFive
              addNode={async (title, description, link = '', focus_area = '', estimated_time = '', type = '') => {
                // ensure minimal payload shape
                const payload = { title, description, link, focus_area, estimated_time, type };
                return await addNode(payload);
              }}
              onNext={() => setStep(6)}
              onBack={goBack}
            />
          </motion.div>
        )}

        {isAdmin && step === 6 && (
          <motion.div key="s6" {...motionProps}>
            <StepSix nodes={nodes} addEdge={addEdge} onBack={goBack} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button footer */}
      {step > 1 && !isAdmin && (
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button className="back-btn" onClick={goBack}>
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

