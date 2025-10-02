// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, Link } from 'expo-router';
import { supabase } from '../../lib/supabase';

const BG_TOP = '#0E0F1A';
const BG_BOT = '#0A0B12';
const CARD   = 'rgba(18,19,30,0.95)';
const TEXT   = '#EDEFF6';
const SUB    = '#9AA0AE';
const OUT    = '#2A2D3A';
const ACCENT = '#8A5CF6';

export default function VerifyEmail() {
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const email = typeof emailParam === 'string' ? emailParam : '';
  const [loading, setLoading] = useState(false);

  const openMailApp = async () => {
    try { await Linking.openURL('mailto:'); } catch {}
  };

  const resend = async () => {
    if (!email) return Alert.alert('Email missing', 'Go back and sign up again.');
    setLoading(true);
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    setLoading(false);
    if (error) Alert.alert('Could not resend', error.message);
    else Alert.alert('Sent', 'We re-sent the verification email. Check your inbox/spam.');
  };

  return (
    <View style={{ flex:1 }}>
      <LinearGradient colors={[BG_TOP, BG_BOT]} style={StyleSheet.absoluteFillObject as any} />
      <View style={styles.center}>
        <View style={styles.card}>
          <Text style={styles.title}>Verify your email</Text>
          <Text style={styles.sub}>
            We sent a confirmation link to{'\n'}
            <Text style={{ color: TEXT, fontWeight:'800' }}>{email || 'your email'}</Text>
          </Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={openMailApp} activeOpacity={0.9}>
            <Text style={styles.primaryText}>Open Mail app</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.secondaryBtn, loading && { opacity:0.6 }]} onPress={resend} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.secondaryText}>Resend verification email</Text>}
          </TouchableOpacity>

          <View style={{ alignItems:'center', marginTop:14 }}>
            <Link href="/(auth)/login"><Text style={{ color: SUB, fontWeight:'700' }}>← Back to Sign In</Text></Link>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex:1, alignItems:'center', justifyContent:'center', padding:20 },
  card: { width:'100%', backgroundColor: CARD, borderRadius:16, borderWidth:1, borderColor: OUT, padding:20 },
  title: { color: TEXT, fontWeight:'900', fontSize:24, marginBottom:6 },
  sub: { color: SUB, marginBottom:16, lineHeight:20 },
  primaryBtn: { backgroundColor: ACCENT, paddingVertical:14, borderRadius:12, alignItems:'center', marginBottom:10 },
  primaryText: { color:'#fff', fontWeight:'800' },
  secondaryBtn: { backgroundColor:'#222538', paddingVertical:12, borderRadius:12, alignItems:'center', borderWidth:1, borderColor: OUT },
  secondaryText: { color:'#fff', fontWeight:'700' },
});
