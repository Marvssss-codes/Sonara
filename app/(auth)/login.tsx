// @ts-nocheck
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  Image, Pressable, Dimensions, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const BG_TOP = '#0E0F1A';
const BG_BOT = '#0A0B12';
const CARD   = 'rgba(18,19,30,0.85)';
const TEXT   = '#EDEFF6';
const SUB    = '#9AA0AE';
const OUT    = '#2A2D3A';
const PILL   = '#141626';
const ACCENT = '#8A5CF6';
const LINK   = '#9AF05A';
const PINK   = '#FF4D91';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);

  const onLogin = () => router.replace('/(tabs)');

  return (
    <View style={{ flex:1, backgroundColor: BG_BOT }}>
      <LinearGradient colors={[BG_TOP, BG_BOT]} style={StyleSheet.absoluteFillObject as any} />

      {/* Hero image (no circle) */}
      <Image
        // royalty-free headphone portrait
        // source={{ uri: 'https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?q=80&w=1200&auto=format&fit=crop' }}
        style={styles.hero}
        resizeMode="cover"
      />

      {/* Subtle grid */}
      <View pointerEvents="none" style={styles.gridWrap}>
        {Array.from({ length: 10 }).map((_, i) => (
          <View key={`v${i}`} style={[styles.gridLineV, { left: (i * width) / 10 }]} />
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <View key={`h${i}`} style={[styles.gridLineH, { top: i * 40 }]} />
        ))}
      </View>

      {/* Keyboard-safe centered content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex:1 }}
      >
        <ScrollView
          contentContainerStyle={styles.centerWrap}
          keyboardShouldPersistTaps="handled"
        >
          {/* Heading */}
          <View style={{ width: '100%' }}>
            <Text style={styles.kicker}>SONARA</Text>
            <Text style={styles.title}>
              Login To{' '}
              <Text style={{ color: '#B2B6C6' }}>Your </Text>
              <Text style={{ color: TEXT }}>Account</Text>
            </Text>
          </View>

          {/* Form card */}
          <View style={styles.card}>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color={SUB} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor={SUB}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={SUB} />
              <TextInput
                value={pw}
                onChangeText={setPw}
                placeholder="Password"
                placeholderTextColor={SUB}
                style={styles.input}
                secureTextEntry={!showPw}
                returnKeyType="go"
              />
              <Pressable onPress={() => setShowPw(v => !v)}>
                <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color={SUB} />
              </Pressable>
            </View>

            <View style={styles.rowBetween}>
              <Link href="/(auth)/reset"><Text style={{ color: PINK, fontWeight:'700' }}>Forgot Password?</Text></Link>
              <Pressable style={styles.remember} onPress={() => setRemember(v => !v)}>
                <View style={[styles.dot, remember && { backgroundColor: ACCENT }]} />
                <Text style={{ color: SUB }}>Remember me</Text>
              </Pressable>
            </View>

            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9} onPress={onLogin}>
              <Text style={styles.primaryText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.orRow}>
              <View style={styles.hr} /><Text style={{ color: SUB }}>OR</Text><View style={styles.hr} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialCircle} activeOpacity={0.85}><AntDesign name="facebook-square" size={22} color="#3b5998" /></TouchableOpacity>
              <TouchableOpacity style={styles.socialCircle} activeOpacity={0.85}><AntDesign name="google" size={22} color="#DB4437" /></TouchableOpacity>
              <TouchableOpacity style={styles.socialCircle} activeOpacity={0.85}><FontAwesome name="apple" size={24} color="#fff" /></TouchableOpacity>
            </View>
          </View>

          <Text style={styles.bottomLine}>
            Don’t have an account?{' '}
            <Link href="/(auth)/signup"><Text style={{ color: LINK, fontWeight:'700' }}>Sign up</Text></Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  centerWrap: {
    flexGrow: 1,
    justifyContent: 'center',   // centers vertically
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  kicker: { color: '#8B90A7', letterSpacing: 2, fontWeight:'800', marginBottom: 6 },
  title: { color: TEXT, fontWeight: '900', fontSize: 28, marginBottom: 16 },

  card: { backgroundColor: CARD, borderRadius: 20, borderWidth: 1, borderColor: OUT, padding: 16 },
  inputRow: { flexDirection:'row', alignItems:'center', gap:10, backgroundColor: PILL, borderWidth:1, borderColor: OUT, borderRadius: 28, paddingHorizontal:14, paddingVertical:12, marginBottom:12 },
  input: { flex:1, color: TEXT },

  rowBetween: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 12 },
  remember: { flexDirection:'row', alignItems:'center', gap:8 },
  dot: { width:16, height:16, borderRadius:8, borderWidth:1, borderColor: OUT },

  primaryBtn: { backgroundColor: ACCENT, paddingVertical: 14, borderRadius: 28, alignItems:'center', marginTop: 4, marginBottom: 14 },
  primaryText: { color:'#fff', fontWeight:'800' },

  orRow: { flexDirection:'row', alignItems:'center', gap:10, marginBottom: 14 },
  hr: { flex:1, height:1, backgroundColor: OUT },

  socialRow: { flexDirection:'row', justifyContent:'space-between', paddingHorizontal: 32, marginBottom: 4 },
  socialCircle: { width:56, height:56, borderRadius:28, alignItems:'center', justifyContent:'center', backgroundColor:'#111423', borderWidth:1, borderColor: OUT },

  bottomLine: { color: SUB, textAlign: 'center', marginTop: 10 },

  hero: { position:'absolute', right: -30, top: 80, width: 300, height: 220, opacity: 0.7, borderTopLeftRadius: 24, borderBottomLeftRadius: 24 },
  gridWrap: { ...StyleSheet.absoluteFillObject, opacity: 0.12 },
  gridLineV: { position:'absolute', top:0, bottom:0, width:1, backgroundColor: '#2A2D3A' },
  gridLineH: { position:'absolute', left:0, right:0, height:1, backgroundColor: '#2A2D3A' },
});
