import { createContext, useContext, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

const SignalRContext = createContext();

export const SignalRProvider = ({ children }) => {
  const connectionRef = useRef(null);

  const startConnection = async (retries = 5, delay = 2000) => {
    if (!connectionRef.current) {
      connectionRef.current = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5127/orderHub', {
          withCredentials: true,
          timeout: 30000,
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Information)
        .build();
    }

    for (let i = 0; i < retries; i++) {
      if (connectionRef.current.state === signalR.HubConnectionState.Connected) {
        console.log('SignalR connection already established');
        return;
      }
      if (connectionRef.current.state === signalR.HubConnectionState.Connecting) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      if (connectionRef.current.state === signalR.HubConnectionState.Disconnected) {
        try {
          await connectionRef.current.start();
          console.log('SignalR connection established');
          return;
        } catch (error) {
          console.error(`Retry ${i + 1}/${retries}:`, error);
          if (i < retries - 1) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }
    }
    throw new Error('Unable to connect to real-time updates after retries.');
  };

  useEffect(() => {
    startConnection().catch((error) => {
      console.error('Initial SignalR connection failed:', error);
    });

    return () => {
      if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
        connectionRef.current.stop();
      }
    };
  }, []);

  return (
    <SignalRContext.Provider value={{ connection: connectionRef.current, startConnection }}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error('useSignalR must be used within a SignalRProvider');
  }
  return context;
};