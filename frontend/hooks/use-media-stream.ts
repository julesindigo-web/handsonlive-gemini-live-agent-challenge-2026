'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useMediaStream() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setIsVideoEnabled(true);
      setIsAudioEnabled(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to access camera and microphone');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsVideoEnabled(false);
      setIsAudioEnabled(false);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const toggleVideo = useCallback(() => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  }, [stream, isVideoEnabled]);

  const toggleAudio = useCallback(() => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  }, [stream, isAudioEnabled]);

  const captureVideoFrame = useCallback((): string | null => {
    if (!videoRef.current || !isVideoEnabled) return null;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }, [isVideoEnabled]);

  const captureAudioChunk = useCallback((): string | null => {
    if (!stream || !isAudioEnabled) return null;

    // For now, return null - audio capture will be implemented separately
    // This is a placeholder for future audio streaming implementation
    return null;
  }, [stream, isAudioEnabled]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    stream,
    videoRef,
    error,
    isVideoEnabled,
    isAudioEnabled,
    startCamera,
    stopCamera,
    toggleVideo,
    toggleAudio,
    captureVideoFrame,
    captureAudioChunk,
  };
}
