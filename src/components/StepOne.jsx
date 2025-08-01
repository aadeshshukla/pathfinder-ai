import React from 'react';

export default function StepOne({ goal, setGoal, onNext }) {
  return (
    <div className="w-full max-w-xl mx-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10 space-y-8 border border-gray-200">
      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">🎯 What's your learning goal?</h2>
      <input
        className="w-full border border-gray-300 p-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="e.g. Become a Full Stack Developer"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <div className="text-right">
        <button
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform duration-150 text-white text-lg font-medium px-6 py-3 rounded-xl shadow-lg"
          onClick={onNext}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

