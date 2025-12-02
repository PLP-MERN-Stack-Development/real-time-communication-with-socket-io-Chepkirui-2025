import React, { useEffect, useRef, useState } from 'react';
import { Check, CheckCheck, Paperclip } from 'lucide-react';

function MessageList({ messages, currentUser }) {
  const messagesEndRef = useRef(null);
  const [messageReactions, setMessageReactions] = useState({});

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReaction = (messageId, reaction) => {
    setMessageReactions((prev) => ({
      ...prev,
      [messageId]: [...(prev[messageId] || []), reaction],
    }));
  };

  const reactions = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg, index) => {
        if (msg.system) {
          return (
            <div key={msg.id} className="flex justify-center">
              <span className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm">
                {msg.message}
              </span>
            </div>
          );
        }

        const isOwnMessage = msg.senderId === currentUser.id || msg.sender === 'You';
        const showAvatar =
          index === 0 || messages[index - 1].senderId !== msg.senderId;

        return (
          <div
            key={msg.id}
            className={`flex ${
              isOwnMessage ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex items-end space-x-2 max-w-2xl ${
                isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {showAvatar && !isOwnMessage && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {msg.sender[0]}
                </div>
              )}
              {!showAvatar && !isOwnMessage && <div className="w-8"></div>}

              <div
                className={`flex flex-col ${
                  isOwnMessage ? 'items-end' : 'items-start'
                }`}
              >
                {showAvatar && !isOwnMessage && (
                  <span className="text-xs font-medium text-gray-600 mb-1 px-2">
                    {msg.sender}
                  </span>
                )}
                <div className="group relative">
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isOwnMessage
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm break-words">{msg.message}</p>
                    {msg.file && (
                      <div className="mt-2 flex items-center space-x-2 text-xs opacity-80">
                        <Paperclip size={14} />
                        <span>{msg.file.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mt-1 px-2">
                    <span className="text-xs text-gray-500">
                      {formatTime(msg.timestamp)}
                    </span>
                    {isOwnMessage && (
                      <span className="text-xs text-gray-500">
                        {msg.read ? (<CheckCheck size={14} className="text-blue-500" />
                    ) : (
                      <Check size={14} />
                    )}
                  </span>
                )}
              </div>

              {/* Reactions */}
              {messageReactions[msg.id]?.length > 0 && (
                <div className="flex space-x-1 mt-1">
                  {[...new Set(messageReactions[msg.id])].map(
                    (reaction, i) => (
                      <span
                        key={i}
                        className="text-sm bg-gray-100 px-2 py-1 rounded-full"
                      >
                        {reaction}
                      </span>
                    )
                  )}
                </div>
              )}

              {/* Reaction Picker */}
              <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex space-x-1">
                {reactions.map((reaction) => (
                  <button
                    key={reaction}
                    onClick={() => handleReaction(msg.id, reaction)}
                    className="hover:bg-gray-100 p-1 rounded transition"
                  >
                    {reaction}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  })}
  <div ref={messagesEndRef} />
</div>
);
}
export default MessageList;