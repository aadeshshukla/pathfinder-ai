import React from 'react';
import { motion } from 'framer-motion';

export default function StepFour({ goal, sortedNodes, onAddNew }) {
  return (
    <div className="space-y-6">
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
        onClick={onAddNew}
      >
        ➕ Add a new resource
      </button>
    </div>
  );
}
