import React from 'react';
import { Hash, Lock, Phone, Video, MoreVertical } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatArea({
  messages,
  currentUser,
  activeRoom,
  selectedUser,
  typingUsers,
  onSendMessage,
  onSetTyping,
}) {
  return (
    <main className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800 flex items-center">
            {selectedUser ? (
              <>
                <Lock size={18} className="mr-2 text-gray-600" />
                Private chat with {selectedUser.username}
              </>
            ) : (
              <>
                <Hash size={18} className="mr-2 text-gray-600" />
                {activeRoom}
              </>
            )}
          </h2>
          {typingUsers.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {typingUsers.join(', ')}{' '}
              {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Phone size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Video size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <MoreVertical size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <MessageList messages={messages} currentUser={currentUser} />

      <MessageInput
        onSendMessage={onSendMessage}
        onSetTyping={onSetTyping}
        placeholder={`Message ${
          selectedUser ? selectedUser.username : `#${activeRoom}`
        }`}
      />
    </main>
  );
}

export default ChatArea;