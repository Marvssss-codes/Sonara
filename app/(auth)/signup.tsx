// @ts-nocheck
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Pressable,
  Image, Dimensions, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';


const { width } = Dimensions.get('window');

const BG_TOP = '#0E0F1A';
const BG_BOT = '#0A0B12';
const CARD   = 'rgba(18,19,30,0.85)';
const TEXT   = '#EDEFF6';
const SUB    = '#9AA0AE';
const OUT    = '#2A2D3A';
const PILL   = '#141626';
const ACCENT = '#8A5CF6';
const LINKC  = '#9AF05A';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);

  const onCreate = async () => {
  if (!email || !pw) return alert('Enter email and password');
  const { error } = await supabase.auth.signUp({ email, password: pw });
  if (error) {
    alert(error.message);
    return;
  }
  // Trigger creates a blank profile row automatically
  router.replace('/profile-setup');
};


  return (
    <View style={{ flex:1, backgroundColor: BG_BOT }}>
      {/* Gradient background */}
      <LinearGradient colors={[BG_TOP, BG_BOT]} style={StyleSheet.absoluteFillObject as any} />

      {/* Hero image (no circle) */}
      <Image
        // source={{ uri: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop' }}
        style={styles.hero}
        resizeMode="cover"
      />

      {/* Subtle grid overlay */}
      <View pointerEvents="none" style={styles.gridWrap}>
        {Array.from({ length: 10 }).map((_, i) => (
          <View key={`v${i}`} style={[styles.gridLineV, { left: (i * width) / 10 }]} />
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <View key={`h${i}`} style={[styles.gridLineH, { top: i * 40 }]} />
        ))}
      </View>

      {/* Keyboard-safe centered content */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex:1 }}>
        <ScrollView contentContainerStyle={styles.centerWrap} keyboardShouldPersistTaps="handled">
          {/* Heading */}
          <View style={{ width:'100%' }}>
            <Text style={styles.kicker}>SONARA</Text>
            <Text style={styles.title}>Create{'\n'}Your Account</Text>
            <Text style={styles.sub}>Start your age-based music journey.</Text>
          </View>

          {/* Form card */}
          <View style={styles.card}>
            {/* Email */}
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

            {/* Password */}
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

            {/* Primary CTA */}
            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9} onPress={onCreate}>
              <Text style={styles.primaryText}>Sign up</Text>
            </TouchableOpacity>

            {/* OR divider */}
            <View style={styles.orRow}>
              <View style={styles.hr} /><Text style={{ color: SUB }}>OR</Text><View style={styles.hr} />
            </View>

            {/* Round social buttons (UI only) */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialCircle} activeOpacity={0.85}>
                <AntDesign name="google" size={22} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialCircle} activeOpacity={0.85}>
                <AntDesign name="facebook-square" size={22} color="#3b5998" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialCircle} activeOpacity={0.85}>
                <FontAwesome name="apple" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom link */}
          <Text style={styles.bottomLine}>
            Already have an account?{' '}
            <Link href="/(auth)/login"><Text style={{ color: LINKC, fontWeight:'700' }}>Log in</Text></Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  centerWrap: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  kicker: { color: '#8B90A7', letterSpacing: 2, fontWeight:'800', marginBottom: 6 },
  title: { color: TEXT, fontWeight: '900', fontSize: 28, marginBottom: 6 },
  sub: { color: SUB, marginBottom: 12 },

  card: { backgroundColor: CARD, borderRadius: 20, borderWidth: 1, borderColor: OUT, padding: 16 },
  inputRow: {
    flexDirection:'row', alignItems:'center', gap:10,
    backgroundColor: PILL, borderWidth:1, borderColor: OUT,
    borderRadius: 28, paddingHorizontal:14, paddingVertical:12, marginBottom:12
  },
  input: { flex:1, color: TEXT },

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
