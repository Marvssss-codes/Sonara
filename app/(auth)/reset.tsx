// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';


const BG   = '#0F0F10';
const CARD = '#17181B';
const TEXT = '#ECEDEE';
const SUB  = '#A8ACB3';
const LINE = '#2A2B30';
const ACC  = '#8A5CF6';

export default function Reset() {
  const router = useRouter();
  const [email, setEmail] = useState('');

 const onSend = async () => {
  if (!email) return alert('Enter your email');
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) alert(error.message);
  else alert('Check your email for the reset link.');
  router.back();
};


  return (
    <View style={s.wrap}>
      <Text style={s.title}>Reset password</Text>
      <Text style={s.sub}>Enter your email and we’ll send a reset link.</Text>

      <View style={s.card}>
        <View style={s.inputRow}>
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

        <TouchableOpacity style={s.primaryBtn} activeOpacity={0.85} onPress={onSend}>
          <Text style={s.primaryText}>Send reset link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex:1, backgroundColor: BG, padding: 20, paddingTop: 54 },
  title: { color: TEXT, fontSize: 26, fontWeight:'900' },
  sub: { color: SUB, marginTop: 6, marginBottom: 8 },
  card: {
    marginTop: 12, backgroundColor: CARD, borderRadius: 16,
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
  },
  primaryText: { color:'#fff', fontWeight:'800' },
});
