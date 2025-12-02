import React from 'react';
import RoomList from './RoomList';
import UserList from './UserList';

function Sidebar({
  rooms,
  activeRoom,
  setActiveRoom,
  users,
  selectedUser,
  setSelectedUser,
  onCreateRoom,
}) {
  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <RoomList
        rooms={rooms}
        activeRoom={activeRoom}
        setActiveRoom={setActiveRoom}
        setSelectedUser={setSelectedUser}
        onCreateRoom={onCreateRoom}
      />
      <UserList
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        setActiveRoom={setActiveRoom}
      />
    </aside>
  );
}

export default Sidebar;