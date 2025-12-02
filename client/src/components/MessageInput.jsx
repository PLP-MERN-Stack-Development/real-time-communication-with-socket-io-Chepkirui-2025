import React, { useState, useRef } from 'react';
import { Send, Paperclip, Smile, Image, X } from 'lucide-react';

function MessageInput({ onSendMessage, onSetTyping, placeholder }) {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleTyping = (e) => {
    setInputMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      onSetTyping(true);
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onSetTyping(false);
    }, 1000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile({
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() || selectedFile) {
      onSendMessage({
        message: inputMessage,
        file: selectedFile,
      });
      setInputMessage('');
      setSelectedFile(null);
      setIsTyping(false);
      onSetTyping(false);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {selectedFile && (
        <div className="mb-3 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <Image size={20} className="text-gray-600" />
            <span className="text-sm text-gray-700">{selectedFile.name}</span>
          </div>
          <button onClick={() => setSelectedFile(null)}>
            <X size={18} className="text-gray-600" />
          </button>
        </div>
      )}

      <div className="flex items-center space-x-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 hover:bg-gray-100 rounded-lg transition"
        >
          <Paperclip size={20} className="text-gray-600" />
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            value={inputMessage}
            onChange={handleTyping}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={placeholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none pr-12"
          />
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 p-1 rounded transition"
          >
            <Smile size={20} className="text-gray-600" />
          </button>
        </div>

        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() && !selectedFile}
          className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default MessageInput;