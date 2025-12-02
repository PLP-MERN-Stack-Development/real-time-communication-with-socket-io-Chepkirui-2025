import React, { useState } from 'react';
import { Hash, Plus, X } from 'lucide-react';

function RoomList({ rooms, activeRoom, setActiveRoom, setSelectedUser, onCreateRoom }) {
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      onCreateRoom(newRoomName);
      setNewRoomName('');
      setShowNewRoomModal(false);
    }
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-800 flex items-center">
          <Hash size={18} className="mr-2" />
          Channels
        </h2>
        <button
          onClick={() => setShowNewRoomModal(true)}
          className="p-1 hover:bg-gray-100 rounded transition"
        >
          <Plus size={18} className="text-gray-600" />
        </button>
      </div>
      <div className="space-y-1">
        {rooms.map((room) => (
          <button
            key={room}
            onClick={() => {
              setActiveRoom(room);
              setSelectedUser(null);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg transition ${
              activeRoom === room
                ? 'bg-indigo-50 text-indigo-600 font-medium'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            # {room}
          </button>
        ))}
      </div>

      {showNewRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New Channel</h3>
              <button onClick={() => setShowNewRoomModal(false)}>
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
              placeholder="Channel name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowNewRoomModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomList;