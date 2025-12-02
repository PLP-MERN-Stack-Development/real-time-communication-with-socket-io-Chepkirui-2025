import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from './socket/socket';
import LoginScreen from './components/LoginScreen';
import ChatArea from './components/ChatArea';
import Sidebar from './components/Sidebar';
import { 
  MessageCircle, 
  Settings, 
  Bell, 
  Search, 
  X 
} from 'lucide-react';

function App() {
  const {
    isConnected,
    messages,
    users,
    typingUsers,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    setTyping,
  } = useSocket();

  const [currentUser, setCurrentUser] = useState(null);
  const [activeRoom, setActiveRoom] = useState('general');
  const [rooms, setRooms] = useState(['general', 'random', 'tech']);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (notificationsEnabled && 'Notification' in window) {
      Notification.requestPermission();
    }
  }, [notificationsEnabled]);

  useEffect(() => {
    const unreadMessages = messages.filter(
      msg => !msg.read && msg.senderId !== currentUser?.id
    );
    setUnreadCount(unreadMessages.length);

    if (unreadMessages.length > 0 && soundEnabled) {
      playNotificationSound();
    }

    if (
      unreadMessages.length > 0 &&
      notificationsEnabled &&
      Notification.permission === 'granted'
    ) {
      const lastMessage = unreadMessages[unreadMessages.length - 1];
      new Notification(`New message from ${lastMessage.sender}`, {
        body: lastMessage.message,
        icon: '/chat-icon.png',
      });
    }
  }, [messages, currentUser, soundEnabled, notificationsEnabled]);

  const playNotificationSound = () => {
    const audio = new Audio(
      'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj=='
    );
    audio.play().catch(() => {});
  };

  const handleLogin = (username) => {
    setCurrentUser({ username, id: Date.now().toString() });
    connect(username);
  };

  const handleLogout = () => {
    disconnect();
    setCurrentUser(null);
  };

  const handleSendMessage = (messageData) => {
    if (selectedUser) {
      sendPrivateMessage(selectedUser.id, messageData.message);
    } else {
      sendMessage(messageData.message);
    }
  };

  const handleCreateRoom = (roomName) => {
    setRooms([...rooms, roomName.toLowerCase()]);
    setActiveRoom(roomName.toLowerCase());
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const filteredMessages = messages.filter(
    (msg) =>
      msg.system ||
      msg.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.sender?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
            <MessageCircle className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">ChatApp</h1>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Search size={20} className="text-gray-600" />
          </button>

          <div className="relative">
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className="p-2 hover:bg-gray-100 rounded-lg transition relative"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Settings size={20} className="text-gray-600" />
          </button>

          <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">
                {currentUser.username}
              </p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {currentUser.username[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Settings</h3>
            <button onClick={() => setShowSettings(false)}>
              <X size={20} className="text-gray-600" />
            </button>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Sound Notifications</span>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                Browser Notifications
              </span>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          rooms={rooms}
          activeRoom={activeRoom}
          setActiveRoom={setActiveRoom}
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          onCreateRoom={handleCreateRoom}
        />

        <ChatArea
          messages={filteredMessages}
          currentUser={currentUser}
          activeRoom={activeRoom}
          selectedUser={selectedUser}
          typingUsers={typingUsers}
          onSendMessage={handleSendMessage}
          onSetTyping={setTyping}
        />
      </div>
    </div>
  );
}

export default App;