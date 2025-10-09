// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Pressable, TextInput, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SpotifyAPI, msToTime } from '@/lib/spotify';
import { mirrorLikeToSupabase, mirrorUnlikeFromSupabase } from '@/lib/favorites';
import { Audio } from 'expo-av';

export default function FavoritesScreen() {
  const [tracks, setTracks] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const soundRef = useRef(null);

  useEffect(() => { load(true); }, []);

  async function load(reset = false) {
    if (loading) return;
    setLoading(true);
    try {
      const limit = 30;
      const data = await SpotifyAPI.getLikedTracks(limit, reset ? 0 : offset);
      const items = data?.items || [];
      const nextOffset = (reset ? 0 : offset) + items.length;
      setTracks(reset ? items : [...tracks, ...items]);
      setOffset(nextOffset);
      setHasMore(items.length === limit);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  async function unlike(id) {
    try { await SpotifyAPI.unlikeTracks([id]);
      setTracks(prev => prev.filter(t => t.track?.id !== id));
      await mirrorUnlikeFromSupabase(id);
    } catch {}
  }

  async function like(id) {
    try { await SpotifyAPI.likeTracks([id]);
      const t = tracks.find(x => x.track?.id === id)?.track;
      if (t) await mirrorLikeToSupabase(t);
    } catch {}
  }

  async function preview(url) {
    try {
      if (soundRef.current) { await soundRef.current.stopAsync(); await soundRef.current.unloadAsync(); soundRef.current = null; }
      if (!url) return;
      const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
      soundRef.current = sound;
    } catch {}
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tracks;
    return tracks.filter(({ track }) =>
      track?.name?.toLowerCase().includes(q) ||
      track?.artists?.some(a => a.name.toLowerCase().includes(q)) ||
      track?.album?.name?.toLowerCase().includes(q)
    );
  }, [tracks, query]);

  function renderItem({ item }) {
    const t = item.track;
    return (
      <View style={styles.row}>
        {t?.album?.images?.[2]?.url ? (
          <Image source={{ uri: t.album.images[2].url }} style={styles.art} />
        ) : <View style={[styles.art, styles.artPlaceholder]} />}
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={1}>{t?.name}</Text>
          <Text style={styles.artist} numberOfLines={1}>{t?.artists?.map(a => a.name).join(', ')} • {t?.album?.name}</Text>
        </View>
        <Text style={styles.duration}>{msToTime(t?.duration_ms)}</Text>
        <Pressable onPress={() => unlike(t?.id)} style={styles.iconBtn}>
          <Ionicons name="heart" size={20} color="#1DB954" />
        </Pressable>
        <Pressable onPress={() => preview(t?.preview_url)} style={styles.iconBtn}>
          <Ionicons name="play" size={18} color="#fff" />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" color="#bbb" size={18} />
        <TextInput placeholder="Search favorites" placeholderTextColor="#888" value={query} onChangeText={setQuery} style={styles.input} />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.track?.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
        onEndReached={() => hasMore && load(false)}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => load(true)} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 12 },
  searchBar: { height: 40, borderRadius: 8, backgroundColor: '#1e1e1e', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginBottom: 10 },
  input: { flex: 1, marginLeft: 8, color: '#fff' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  art: { width: 44, height: 44, borderRadius: 6, backgroundColor: '#222' },
  artPlaceholder: { backgroundColor: '#222' },
  meta: { flex: 1, marginHorizontal: 10 },
  title: { color: '#fff', fontWeight: '600' },
  artist: { color: '#bbb', marginTop: 2, fontSize: 12 },
  duration: { color: '#aaa', width: 50, textAlign: 'right' },
  heart: { paddingHorizontal: 8, paddingVertical: 6, marginLeft: 6 },
});


