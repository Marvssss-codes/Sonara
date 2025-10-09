// @ts-nocheck
import React, { useMemo, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { usePlayback } from '@/providers/playback';
import { msToTime } from '@/lib/spotify';
import { mirrorLikeToSupabase, mirrorUnlikeFromSupabase } from '@/lib/favorites';
import Slider from '@react-native-community/slider';
import { MotiView } from 'moti';
import { SpotifyAPI } from '@/lib/spotify';

export default function PlayerScreen() {
  const { currentTrack, isPlaying, progressMs, durationMs, togglePlayPause, next, previous, shuffle, repeat, setShuffleState, setRepeatState } = usePlayback();
  const [liked, setLiked] = useState(false);
  const image = currentTrack?.album?.images?.[0]?.url;
  const [start, end] = useMemo(() => ['#121212', '#000000'], [image]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={[start, end]} style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        {image ? (
          <MotiView from={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'timing', duration: 500 }}>
            <Image source={{ uri: image }} style={styles.art} />
          </MotiView>
        ) : <View style={[styles.art, styles.artPlaceholder]} />}
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack?.name || 'Tap to Play a Song'}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentTrack?.artists?.map(a => a.name).join(', ') || ''}</Text>
        </View>

        <View style={styles.progressRow}>
          <Text style={styles.progressText}>{msToTime(progressMs)}</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBar, { width: `${durationMs ? (progressMs / durationMs) * 100 : 0}%` }]} />
          </View>
          <Text style={styles.progressText}>{msToTime(durationMs)}</Text>
        </View>

        <View style={styles.controlsRow}>
          <Pressable onPress={() => setShuffleState(!shuffle)}>
            <Ionicons name="shuffle" size={22} color={shuffle ? '#1DB954' : '#fff'} />
          </Pressable>
          <Pressable onPress={previous}>
            <Ionicons name="play-skip-back" size={28} color="#fff" />
          </Pressable>
          <Pressable onPress={togglePlayPause} style={styles.playBtn}>
            <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={72} color="#fff" />
          </Pressable>
          <Pressable onPress={next}>
            <Ionicons name="play-skip-forward" size={28} color="#fff" />
          </Pressable>
          <Pressable onPress={() => setRepeatState(repeat === 'off' ? 'track' : repeat === 'track' ? 'context' : 'off')}>
            <Ionicons name="repeat" size={22} color={repeat !== 'off' ? '#1DB954' : '#fff'} />
          </Pressable>
        </View>

        <View style={styles.likeRow}>
          <Pressable onPress={async () => {
            if (!currentTrack?.id) return;
            try { if (liked) { await mirrorUnlikeFromSupabase(currentTrack.id); setLiked(false); } else { await mirrorLikeToSupabase(currentTrack); setLiked(true); } } catch {}
          }}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? '#1DB954' : '#fff'} />
          </Pressable>
        </View>

        <View style={styles.volumeRow}>
          <Ionicons name="volume-low" size={18} color="#bbb" />
          <Slider style={{ flex: 1, marginHorizontal: 10 }} minimumValue={0} maximumValue={1} minimumTrackTintColor="#1DB954" maximumTrackTintColor="#333" onValueChange={(v) => SpotifyAPI.setVolume(Math.round(v * 100))} />
          <Ionicons name="volume-high" size={18} color="#bbb" />
        </View>

        <Slider
          style={{ width: '100%', marginTop: 8 }}
          minimumValue={0}
          maximumValue={durationMs || 1}
          value={progressMs}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#333"
          onSlidingComplete={(val) => SpotifyAPI.seek(val)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 32, alignItems: 'center' },
  art: { width: 320, height: 320, borderRadius: 12, marginTop: 40 },
  artPlaceholder: { backgroundColor: '#222' },
  meta: { width: '100%', marginTop: 24 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', textAlign: 'center' },
  artist: { color: '#bbb', fontSize: 14, marginTop: 6, textAlign: 'center' },
  progressRow: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18 },
  progressText: { color: '#aaa', fontSize: 12 },
  progressBarBg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#333', overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#1DB954' },
  controlsRow: { width: '100%', marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  playBtn: { paddingHorizontal: 8 },
  likeRow: { width: '100%', marginTop: 12, alignItems: 'center' },
  volumeRow: { width: '100%', marginTop: 10, flexDirection: 'row', alignItems: 'center' },
});


