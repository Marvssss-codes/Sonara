// @ts-nocheck
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

async function getAccessToken() {
  // Try to derive a Spotify access token from the Supabase session
  const { data } = await supabase.auth.getSession();
  const session = data?.session;
  const providerToken = session?.provider_token || session?.provider_token?.access_token;

  if (providerToken) return providerToken;

  // Fallback to a public env token for demo/testing flows
  if (process.env.EXPO_PUBLIC_SPOTIFY_TOKEN) {
    return process.env.EXPO_PUBLIC_SPOTIFY_TOKEN;
  }

  // Check AsyncStorage saved token from AuthSession login
  try {
    const exp = await AsyncStorage.getItem('spotify:expires_in');
    const token = await AsyncStorage.getItem('spotify:access_token');
    if (token && (!exp || Number(exp) > Date.now())) return token;
  } catch {}

  // As a last resort, attempt to read from a user_tokens table if present
  try {
    const userId = session?.user?.id;
    if (!userId) return null;
    const { data: tokenRows } = await supabase
      .from('user_tokens')
      .select('spotify_access_token')
      .eq('user_id', userId)
      .maybeSingle();
    return tokenRows?.spotify_access_token || null;
  } catch (e) {
    return null;
  }
}

async function spotifyFetch(path, init = {}) {
  const token = await getAccessToken();
  if (!token) throw new Error('Missing Spotify access token');

  const res = await fetch(`${SPOTIFY_API_BASE}${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Spotify API error ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const SpotifyAPI = {
  getAccessToken,
  me: () => spotifyFetch('/me'),
  getCurrentlyPlaying: () => spotifyFetch('/me/player/currently-playing'),
  getPlayer: () => spotifyFetch('/me/player'),
  play: (body) => spotifyFetch('/me/player/play', { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  pause: () => spotifyFetch('/me/player/pause', { method: 'PUT' }),
  next: () => spotifyFetch('/me/player/next', { method: 'POST' }),
  previous: () => spotifyFetch('/me/player/previous', { method: 'POST' }),
  shuffle: (state) => spotifyFetch(`/me/player/shuffle?state=${state ? 'true' : 'false'}`, { method: 'PUT' }),
  repeat: (state) => spotifyFetch(`/me/player/repeat?state=${state}`, { method: 'PUT' }), // state: off|track|context
  likeTracks: (ids) => spotifyFetch(`/me/tracks?ids=${ids.join(',')}`, { method: 'PUT' }),
  unlikeTracks: (ids) => spotifyFetch(`/me/tracks?ids=${ids.join(',')}`, { method: 'DELETE' }),
  getLikedTracks: (limit = 20, offset = 0) => spotifyFetch(`/me/tracks?limit=${limit}&offset=${offset}`),
  search: (q, type = 'track', limit = 20) => spotifyFetch(`/search?q=${encodeURIComponent(q)}&type=${type}&limit=${limit}`),
  seek: (positionMs) => spotifyFetch(`/me/player/seek?position_ms=${Math.max(0, Math.floor(positionMs))}`, { method: 'PUT' }),
  setVolume: (volumePercent) => spotifyFetch(`/me/player/volume?volume_percent=${Math.max(0, Math.min(100, Math.floor(volumePercent)))}` , { method: 'PUT' }),
};

export function msToTime(ms = 0) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}


