import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSignalR } from '../context/SignalRContext';

const BroadcastMessages = () => {
  const { user, isAuthenticated } = useAuth();
  const { connection, startConnection } = useSignalR();
  const [messages, setMessages] = useState([]);
  const [isVisible, setIsVisible] = useState(() => {
    const key = user?.id ? `broadcastBannerVisible_${user.id}` : 'broadcastBannerVisible';
    return localStorage.getItem(key) !== 'false';
  });
  const [seenMessageIds, setSeenMessageIds] = useState(() => {
    const key = user?.id ? `seenBroadcastMessageIds_${user.id}` : 'seenBroadcastMessageIds';
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });
  const [error, setError] = useState(null);
  const connectionRef = useRef(null);
  const timerRef = useRef(null);
  const lastFetchRef = useRef(0);

  // Save isVisible to localStorage
  useEffect(() => {
    const key = user?.id ? `broadcastBannerVisible_${user.id}` : 'broadcastBannerVisible';
    localStorage.setItem(key, isVisible.toString());
  }, [isVisible, user]);

  // Save seenMessageIds to localStorage
  useEffect(() => {
    const key = user?.id ? `seenBroadcastMessageIds_${user.id}` : 'seenBroadcastMessageIds';
    localStorage.setItem(key, JSON.stringify(seenMessageIds));
  }, [seenMessageIds, user]);

  // Clear state on logout
  useEffect(() => {
    if (!isAuthenticated) {
      const keyPrefix = user?.id ? `_${user.id}` : '';
      localStorage.removeItem(`seenBroadcastMessageIds${keyPrefix}`);
      localStorage.removeItem(`broadcastBannerVisible${keyPrefix}`);
      setMessages([]);
      setSeenMessageIds([]);
      setIsVisible(false);
    }
  }, [isAuthenticated, user]);

  // Auto-dismiss banner after 6 seconds and move to next message
  useEffect(() => {
    if (isVisible && messages.length > 0 && !timerRef.current) {
      timerRef.current = setTimeout(() => {
        setMessages((prev) => prev.slice(1)); // Remove the first message
        if (messages.length <= 1) setIsVisible(false); // Hide if no messages left
        timerRef.current = null;
      }, 6000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isVisible, messages.length]);

  // Fetch initial messages
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5127/api/order/broadcasts', {
          withCredentials: true,
        });
        const newMessages = response.data
          .filter((msg) => !seenMessageIds.includes(msg.id))
          .map((msg) => ({
            id: msg.id,
            message: msg.message,
          }));
        if (newMessages.length > 0) {
          setMessages((prev) => [...new Set([...prev, ...newMessages])]);
          setSeenMessageIds((prev) => [
            ...new Set([...prev, ...newMessages.map((msg) => msg.id)]),
          ]);
          setIsVisible(true);
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching broadcast messages:', error);
        setError('Failed to load recent orders. Please try again later.');
      }
    };

    fetchMessages();
  }, [isAuthenticated]);

  // SignalR event handling
  useEffect(() => {
    if (!isAuthenticated || !connection) return;

    connectionRef.current = connection;

    connection.on('orderBroadcast', (message) => {
      console.log('Received orderBroadcast:', message);
      const now = Date.now();
      if (now - lastFetchRef.current < 5000) {
        console.log('Skipping duplicate broadcast due to debounce');
        return;
      }
      lastFetchRef.current = now;

      // Display message directly
      const tempId = `temp-${Date.now()}`;
      const newMessage = { id: tempId, message };
      setMessages((prev) => [...new Set([...prev, newMessage])]);
      setSeenMessageIds((prev) => [...new Set([...prev, tempId])]);
      setIsVisible(true);

      // Sync with database after 10 seconds
      const fetchNewMessages = async () => {
        try {
          const response = await axios.get('http://localhost:5127/api/order/broadcasts', {
            withCredentials: true,
          });
          const newMessages = response.data
            .filter((msg) => !seenMessageIds.includes(msg.id))
            .map((msg) => ({ id: msg.id, message: msg.message }));
          if (newMessages.length > 0) {
            setMessages((prev) => [...new Set([...prev, ...newMessages])]);
            setSeenMessageIds((prev) => [
              ...new Set([...prev, ...newMessages.map((msg) => msg.id)]),
            ]);
          }
        } catch (error) {
          console.error('Error syncing broadcast messages:', error);
        }
      };
      setTimeout(fetchNewMessages, 10000);
    });

    return () => {
      connection.off('orderBroadcast');
    };
  }, [isAuthenticated, connection, seenMessageIds]);

  const handleDismiss = () => {
    setIsVisible(false);
    setMessages([]); // Clear messages on manual dismiss
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleResetSeenMessages = () => {
    const key = user?.id ? `seenBroadcastMessageIds_${user.id}` : 'seenBroadcastMessageIds';
    setSeenMessageIds([]);
    localStorage.setItem(key, JSON.stringify([]));
    setIsVisible(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleRetryConnection = () => {
    setError(null);
    startConnection();
  };

  if (!isAuthenticated || !isVisible || (messages.length === 0 && !error)) {
    console.log('Banner hidden:', { isAuthenticated, isVisible, messagesLength: messages.length, error });
    return null;
  }

  return (
    <div
      className={`fixed bottom-5 right-5 bg-gradient-to-br from-amber-50 to-gray-100 border-2 border-amber-700 rounded-xl p-4 max-w-xs shadow-xl z-50 transition-all duration-500 ease-out transform ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <button
        className="absolute top-2 right-2 text-amber-900 hover:text-amber-600 text-xl font-bold transition-transform duration-200 hover:scale-110"
        onClick={handleDismiss}
      >
        ×
      </button>
      <h4 className="font-serif text-base font-bold text-amber-900 mb-2 flex items-center before:content-['📚'] before:mr-2">
        Recent Orders
      </h4>
      {error ? (
        <div>
          <p className="text-sm text-red-600 mb-2">{error}</p>
          <button
            className="text-sm text-teal-600 hover:text-teal-800 hover:underline transition-colors duration-200"
            onClick={handleRetryConnection}
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <>
          {messages.slice(0, 1).map((msg, index) => (
            <p
              key={msg.id || index}
              className="text-sm text-gray-700 mb-2 leading-relaxed"
            >
              {msg.message}
            </p>
          ))}
          <button
            className="text-sm text-teal-600 hover:text-teal-800 hover:underline transition-colors duration-200"
            onClick={handleResetSeenMessages}
            title="Reset seen messages to show all again"
          >
            Reset Notifications
          </button>
        </>
      )}
    </div>
  );
};

export default BroadcastMessages;