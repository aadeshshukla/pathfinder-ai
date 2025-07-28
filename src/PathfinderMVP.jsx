import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function PathfinderMVP() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [context, setContext] = useState({ level: '', time: '', preference: '' });
  const [nodeData, setNodeData] = useState([]);

  useEffect(() => {
    const fetchNodes = async () => {
      const { data, error } = await supabase.from('nodes').select('*');
      if (error) {
        console.error('Supabase error:', error);
      } else {
        setNodeData(data);
      }
    };

    fetchNodes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl space-y-8">
        {step === 1 && (
          <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">🎯 What's your learning goal?</h2>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Become a Full Stack Developer"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
            <div className="text-right">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                onClick={() => setStep(2)}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">🧠 Tell us about yourself</h2>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg"
              placeholder="Your skill level (e.g. Beginner)"
              onChange={(e) => setContext({ ...context, level: e.target.value })}
            />
            <input
              className="w-full border border-gray-300 p-3 rounded-lg"
              placeholder="Time per week (e.g. 5 hrs/week)"
              onChange={(e) => setContext({ ...context, time: e.target.value })}
            />
            <input
              className="w-full border border-gray-300 p-3 rounded-lg"
              placeholder="Preferred content (e.g. Video, Free)"
              onChange={(e) => setContext({ ...context, preference: e.target.value })}
            />
            <div className="text-right">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                onClick={() => setStep(3)}
              >
                Generate Path →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-pulse">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">⚙️ Mapping your journey...</h2>
            <p className="text-gray-600">Analyzing your inputs and curating resources...</p>
            <button
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              onClick={() => setStep(4)}
            >
              Show Path
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">📍 Your Learning Path: {goal}</h2>
            {nodeData.length === 0 ? (
              <p className="text-gray-500">No resources found. Please check your Supabase data.</p>
            ) : (
              nodeData.map((step, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-md">
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
                  <p className="text-sm text-gray-500 mt-1">⏱ Estimated Time: {step.estimated_time}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}



