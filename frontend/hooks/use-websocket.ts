'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { LiveClient } from '@/lib/websocket-client';

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [agentResponse, setAgentResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<LiveClient | null>(null);

  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, []);

  const connect = useCallback(async (userId: string, skill: string, language: string) => {
    try {
      setError(null);
      if (!clientRef.current) {
        clientRef.current = new LiveClient(url);
      }

      await clientRef.current.connect(userId, skill, language);
      setIsConnected(true);

      clientRef.current.onMessage((message) => {
        console.log('WebSocket message received:', message);

        if (message.type === 'agent_response') {
          setAgentResponse(message.data.text || '');
        } else if (message.type === 'session_created') {
          console.log('Session created:', message.data);
        } else if (message.type === 'error') {
          setError(message.message || 'Unknown error');
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setIsConnected(false);
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      setIsConnected(false);
      setAgentResponse('');
    }
  }, []);

  const sendVideoFrame = useCallback((data: string) => {
    if (clientRef.current) {
      clientRef.current.sendVideoFrame(data);
    }
  }, []);

  const sendAudioChunk = useCallback((data: string) => {
    if (clientRef.current) {
      clientRef.current.sendAudioChunk(data);
    }
  }, []);

  const sendInterruption = useCallback((message: string) => {
    if (clientRef.current) {
      clientRef.current.sendInterruption(message);
    }
  }, []);

  return {
    isConnected,
    agentResponse,
    error,
    connect,
    disconnect,
    sendVideoFrame,
    sendAudioChunk,
    sendInterruption,
  };
}
