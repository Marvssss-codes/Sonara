// @ts-nocheck
import React from 'react';
import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePlayback } from '@/providers/playback';
import { MotiView } from 'moti';

export default function MiniPlayer() {
  const router = useRouter();
  const { currentTrack, isPlaying, togglePlayPause } = usePlayback();

  if (!currentTrack) return null;

  return (
    <MotiView from={{ translateY: 20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ type: 'timing', duration: 300 }}>
      <Pressable onPress={() => router.push('/(tabs)/player')} style={styles.container}>
        <View style={styles.left}>
          {currentTrack?.album?.images?.[0]?.url ? (
            <Image source={{ uri: currentTrack.album.images[0].url }} style={styles.art} />
          ) : null}
          <View style={styles.meta}>
            <Text style={styles.title} numberOfLines={1}>{currentTrack.name}</Text>
            <Text style={styles.artist} numberOfLines={1}>{currentTrack.artists?.map(a => a.name).join(', ')}</Text>
          </View>
        </View>
        <Pressable onPress={(e) => { e.stopPropagation(); togglePlayPause(); }} style={styles.play}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} color="#fff" size={22} />
        </Pressable>
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(18,18,18,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  left: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  art: { width: 40, height: 40, borderRadius: 6, marginRight: 10 },
  meta: { flex: 1 },
  title: { color: '#fff', fontWeight: '600' },
  artist: { color: '#bbb', fontSize: 12, marginTop: 2 },
  play: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});


