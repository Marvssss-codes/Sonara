// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BG   = '#0F0F10';
const CARD = '#17181B';
const TEXT = '#ECEDEE';
const SUB  = '#A8ACB3';
const LINE = '#2A2B30';
const ACC  = '#8A5CF6';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);

  const onCreate = () => {
    // (Later) replace with Supabase sign-up
    router.replace('/profile-setup'); // we’ll create this screen next step
  };

  return (
    <View style={s.wrap}>
      <View style={{ marginBottom: 18 }}>
        <Text style={s.brand}>SONARA</Text>
        <Text style={s.title}>Create account</Text>
        <Text style={s.sub}>Start your age-based music journey.</Text>
      </View>

      <View style={s.card}>
        {/* email */}
        <View style={s.inputRow}>
          <Ionicons name="mail-outline" size={20} color={SUB} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={SUB}
            autoCapitalize="none"
            keyboardType="email-address"
            style={s.input}
          />
        </View>

        {/* password */}
        <View style={s.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color={SUB} />
          <TextInput
            value={pw}
            onChangeText={setPw}
            placeholder="At least 6 characters"
            placeholderTextColor={SUB}
            secureTextEntry={!showPw}
            style={s.input}
          />
          <Pressable onPress={() => setShowPw(v => !v)}>
            <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color={SUB} />
          </Pressable>
        </View>

        <TouchableOpacity style={s.primaryBtn} activeOpacity={0.85} onPress={onCreate}>
          <Text style={s.primaryText}>Create account</Text>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems:'center', marginTop: 14 }}>
        <Text style={s.sub}>
          Already have an account?{' '}
          <Link href="/(auth)/login"><Text style={[s.link, { color: ACC }]}>Log in</Text></Link>
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex:1, backgroundColor: BG, padding: 20, paddingTop: 54 },
  brand: { color: ACC, fontWeight:'800', letterSpacing: 2, marginBottom: 6 },
  title: { color: TEXT, fontSize: 26, fontWeight:'900' },
  sub: { color: SUB, marginTop: 4 },
  card: {
    marginTop: 18, backgroundColor: CARD, borderRadius: 16,
    borderWidth: 1, borderColor: LINE, padding: 16, gap: 12,
  },
  inputRow: {
    flexDirection:'row', alignItems:'center', gap:10,
    backgroundColor: BG, borderRadius: 12,
    borderWidth: 1, borderColor: LINE, paddingHorizontal: 12, paddingVertical: 12,
  },
  input: { flex:1, color: TEXT },
  primaryBtn: {
    marginTop: 14, backgroundColor: ACC, paddingVertical: 14,
    borderRadius: 14, alignItems:'center',
    shadowColor: ACC, shadowOpacity: 0.35, shadowRadius: 10, elevation: 4,
  },
  primaryText: { color:'#fff', fontWeight:'800' },
  link: { fontWeight:'700' },
});
