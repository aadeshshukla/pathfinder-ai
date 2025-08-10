import React from 'react';
import './StepFour.css';
import { motion } from 'framer-motion';

export default function StepFour({ nodes, sortedNodes, onNext }) {
  return (
    <div className="step-container">
      <h2>Your Learning Roadmap</h2>
      <div className="roadmap-container">
        <ul className="timeline">
          {sortedNodes.map((node, index) => (
            <motion.li
              key={node.id}
              className="timeline-item"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, duration: 0.4 }}
            >
              <div className="timeline-marker">{index + 1}</div>
              <div className="timeline-content">
                <h3>{node.title}</h3>
                {node.description && <p>{node.description}</p>}
                {node.link && (
                  <p>
                    <a
                      href={node.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Resource →
                    </a>
                  </p>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={onNext}>Continue</button>
      </div>
    </div>
  );
}






