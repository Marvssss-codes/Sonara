// @ts-nocheck
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      // later we'll check auth; for now, go to onboarding
      router.replace('/onboarding');
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Sonara</Text>
      <ActivityIndicator />
      <Text style={styles.sub}>Loading…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, alignItems:'center', justifyContent:'center', gap:8, backgroundColor:'#0F0F10' },
  logo: { color:'#ECEDEE', fontSize:28, fontWeight:'800' },
  sub: { color:'#A8ACB3' },
});
