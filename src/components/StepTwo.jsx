import React from 'react';

export default function StepTwo({ context, setContext, onNext }) {
  return (
    <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🧠 Tell us about yourself</h2>
      <input
        className="w-full border p-3 rounded"
        placeholder="Your skill level"
        value={context.level}
        onChange={(e) => setContext({ ...context, level: e.target.value })}
      />
      <input
        className="w-full border p-3 rounded"
        placeholder="Time per week"
        value={context.time}
        onChange={(e) => setContext({ ...context, time: e.target.value })}
      />
      <input
        className="w-full border p-3 rounded"
        placeholder="Preferred content"
        value={context.preference}
        onChange={(e) => setContext({ ...context, preference: e.target.value })}
      />
      <div className="text-right">
        <button
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform duration-150 text-white px-5 py-2 rounded-xl shadow-md"
          onClick={onNext}
        >
          Generate Path →
        </button>
      </div>
    </div>
  );
}
