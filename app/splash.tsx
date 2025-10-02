// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, Easing, Image, StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const BG_TOP = '#0E0F1A';
const BG_BOT = '#0A0B12';
const TEXT   = '#EDEFF6';
const SUB    = '#9AA0AE';
const ACCENT = '#8A5CF6';

export default function Splash() {
  const router = useRouter();

  // animations
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const bar = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // logo fade + scale
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 120, useNativeDriver: true }),
    ]).start();

    // animated loading bar (loops)
    Animated.loop(
      Animated.sequence([
        Animated.timing(bar, { toValue: 1, duration: 1100, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
        Animated.timing(bar, { toValue: 0, duration: 0, useNativeDriver: false }),
        Animated.delay(200),
      ])
    ).start();

    // navigate after a moment (replace with auth check later)
    const t = setTimeout(() => router.replace('/onboarding'), 1600);
    return () => clearTimeout(t);
  }, []);

  const barWidth = bar.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.55],
  });

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      {/* gradient background */}
      <LinearGradient colors={[BG_TOP, BG_BOT]} style={StyleSheet.absoluteFillObject as any} />

      {/* subtle grid overlay */}
      <View pointerEvents="none" style={styles.gridWrap}>
        {Array.from({ length: 10 }).map((_, i) => (
          <View key={`v${i}`} style={[styles.gridLineV, { left: (i * width) / 10 }]} />
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <View key={`h${i}`} style={[styles.gridLineH, { top: i * 40 }]} />
        ))}
      </View>

      {/* center content */}
      <View style={styles.center}>
        <Animated.View style={{ alignItems: 'center', opacity: fade, transform: [{ scale }] }}>
          {/* mark + wordmark */}
          <View style={styles.badge}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1518449007433-6f7f43f1e9f8?q=80&w=720&auto=format&fit=crop' }} // abstract audio waves
              style={styles.badgeImg}
            />
            <Text style={styles.badgeNote}>♪</Text>
          </View>
          <Text style={styles.brand}>SONARA</Text>
          <Text style={styles.tag}>Age-based music discovery</Text>

          {/* loading bar */}
          <View style={styles.barTrack}>
            <Animated.View style={[styles.barFill, { width: barWidth }]} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // logo badge
  badge: {
    width: 96, height: 96, borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: '#2A2D3A', marginBottom: 12,
  },
  badgeImg: { width: '100%', height: '100%', opacity: 0.6 },
  badgeNote: {
    position: 'absolute', right: 10, bottom: 8,
    color: ACCENT, fontSize: 28, fontWeight: '900',
  },

  brand: { color: TEXT, fontSize: 30, fontWeight: '900', letterSpacing: 1 },
  tag: { color: SUB, marginTop: 6 },

  barTrack: {
    marginTop: 16, width: '60%', height: 6,
    backgroundColor: '#191B26', borderRadius: 6, overflow: 'hidden',
    borderWidth: 1, borderColor: '#2A2D3A',
  },
  barFill: { height: '100%', backgroundColor: ACCENT, borderRadius: 6 },

  // grid
  gridWrap: { ...StyleSheet.absoluteFillObject, opacity: 0.1 },
  gridLineV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: '#2A2D3A' },
  gridLineH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#2A2D3A' },
});
