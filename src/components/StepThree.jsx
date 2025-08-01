import React from 'react';

export default function StepThree({ onNext }) {
  return (
    <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 text-center animate-pulse">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">⚙️ Mapping your journey...</h2>
      <p className="text-gray-600">Analyzing your inputs and curating resources...</p>
      <button
        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        onClick={onNext}
      >
        Show Path
      </button>
    </div>
  );
}
