// src/hooks/useWebSocket.js

import { useEffect, useState } from 'react';

const useWebSocket = (url, eventName, userId, callback) => {
    useEffect(() => {
      if (!userId) return;
  
      const ws = new WebSocket(url);
  
      ws.onopen = () => {
        console.log('WebSocket connection established');
        ws.send(JSON.stringify({ type: 'REGISTER', userId }));
      };
  
      ws.onmessage = (event) => {
        console.log('Message received:', event.data); // Add logging here
        const message = JSON.parse(event.data);
        if (message.type === eventName) {
          callback(message.payload);
        }
      };
  
      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
  
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
  
      return () => {
        ws.close();
      };
    }, [url, eventName, userId, callback]);
  };

export default useWebSocket;