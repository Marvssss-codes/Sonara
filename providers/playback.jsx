// @ts-nocheck
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SpotifyAPI } from '@/lib/spotify';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlaybackContext = createContext(null);

export function PlaybackProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressMs, setProgressMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off');
  const pollingRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const cached = await AsyncStorage.getItem('sonara:lastTrack');
        if (cached && !currentTrack) setCurrentTrack(JSON.parse(cached));
      } catch {}
    })();
  }, []);

  useEffect(() => {
    startPolling();
    return stopPolling;
  }, []);

  function startPolling() {
    stopPolling();
    pollingRef.current = setInterval(fetchPlayerState, 2000);
    fetchPlayerState();
  }
  function stopPolling() {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = null;
  }

  async function fetchPlayerState() {
    try {
      const now = await SpotifyAPI.getCurrentlyPlaying();
      if (!now || !now.item) return;
      setCurrentTrack(now.item);
      setIsPlaying(now.is_playing);
      setProgressMs(now.progress_ms || 0);
      setDurationMs(now.item.duration_ms || 0);
      await AsyncStorage.setItem('sonara:lastTrack', JSON.stringify(now.item));
    } catch {}
  }

  async function togglePlayPause() {
    try {
      if (isPlaying) await SpotifyAPI.pause(); else await SpotifyAPI.play();
      setIsPlaying(!isPlaying);
      fetchPlayerState();
    } catch {}
  }
  async function next() { try { await SpotifyAPI.next(); fetchPlayerState(); } catch {} }
  async function previous() { try { await SpotifyAPI.previous(); fetchPlayerState(); } catch {} }
  async function setShuffleState(state) { try { await SpotifyAPI.shuffle(state); setShuffle(state); } catch {} }
  async function setRepeatState(state) { try { await SpotifyAPI.repeat(state); setRepeat(state); } catch {} }

  const value = useMemo(() => ({
    currentTrack,
    isPlaying,
    progressMs,
    durationMs,
    shuffle,
    repeat,
    togglePlayPause,
    next,
    previous,
    setShuffleState,
    setRepeatState,
    refresh: fetchPlayerState,
  }), [currentTrack, isPlaying, progressMs, durationMs, shuffle, repeat]);

  return (
    <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>
  );
}

export function usePlayback() { return useContext(PlaybackContext); }


