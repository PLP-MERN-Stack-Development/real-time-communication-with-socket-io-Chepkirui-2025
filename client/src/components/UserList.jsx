import React from 'react';
import { Users } from 'lucide-react';

function UserList({ users, selectedUser, setSelectedUser, setActiveRoom }) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h2 className="font-semibold text-gray-800 mb-3 flex items-center">
        <Users size={18} className="mr-2" />
        Online Users ({users.length})
      </h2>
      <div className="space-y-2">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => {
              setSelectedUser(user);
              setActiveRoom(null);
            }}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${
              selectedUser?.id === user.id
                ? 'bg-indigo-50 border border-indigo-200'
                : 'hover:bg-gray-100'
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  user.online ? 'bg-green-500' : 'bg-gray-400'
                }`}
              ></div>
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-800 text-sm">
                {user.username}
              </p>
              <p className="text-xs text-gray-500">
                {user.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default UserList;