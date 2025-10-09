// @ts-nocheck
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { usePlayback } from '@/providers/playback';

export default function NowPlayingBanner() {
  const { currentTrack, isPlaying } = usePlayback();
  if (!currentTrack) return null;
  return (
    <View style={styles.container}>
      {currentTrack?.album?.images?.[2]?.url ? (
        <Image source={{ uri: currentTrack.album.images[2].url }} style={styles.art} />
      ) : null}
      <Text style={styles.text} numberOfLines={1}>
        {isPlaying ? 'Now Playing • ' : 'Paused • '}
        {currentTrack?.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 8, left: 12, right: 12, height: 28, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  art: { width: 20, height: 20, borderRadius: 4, marginRight: 8 },
  text: { color: '#fff', fontSize: 12 },
});


