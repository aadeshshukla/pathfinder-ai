import React from 'react';

export default function StepFive({ newNode, setNewNode, onAdd }) {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">➕ Add New Resource</h2>
      <input className="w-full border p-3 rounded" placeholder="Title"
        value={newNode.title}
        onChange={(e) => setNewNode({ ...newNode, title: e.target.value })} />
      <input className="w-full border p-3 rounded" placeholder="Description"
        value={newNode.description}
        onChange={(e) => setNewNode({ ...newNode, description: e.target.value })} />
      <input className="w-full border p-3 rounded" placeholder="Link"
        value={newNode.link}
        onChange={(e) => setNewNode({ ...newNode, link: e.target.value })} />
      <input className="w-full border p-3 rounded" placeholder="Focus Area"
        value={newNode.focus_area}
        onChange={(e) => setNewNode({ ...newNode, focus_area: e.target.value })} />
      <input className="w-full border p-3 rounded" placeholder="Estimated Time"
        value={newNode.estimated_time}
        onChange={(e) => setNewNode({ ...newNode, estimated_time: e.target.value })} />
      <input className="w-full border p-3 rounded" placeholder="Type (e.g. video, doc)"
        value={newNode.type}
        onChange={(e) => setNewNode({ ...newNode, type: e.target.value })} />
      <div className="text-right">
        <button
          className="bg-green-600 hover:bg-green-700 active:scale-95 transition-transform duration-150 text-white px-6 py-2 rounded-lg"
          onClick={onAdd}
        >
          Add Resource
        </button>
      </div>
    </div>
  );
}
