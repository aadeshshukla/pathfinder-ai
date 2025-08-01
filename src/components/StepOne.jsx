import React from 'react';

export default function StepOne({ goal, setGoal, onNext }) {
  return (
    <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 space-y-6">
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
          onClick={onNext}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
