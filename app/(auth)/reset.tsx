// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

const BG_TOP = '#0E0F1A';
const BG_BOT = '#0A0B12';
const CARD   = 'rgba(18,19,30,0.95)';
const TEXT   = '#EDEFF6';
const SUB    = '#9AA0AE';
const OUT    = '#2A2D3A';
const ACCENT = '#8A5CF6';

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    if (!email) return Alert.alert('Enter your email');
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Check your email', 'We sent a password reset link.');
  };

  return (
    <View style={{ flex:1 }}>
      <LinearGradient colors={[BG_TOP, BG_BOT]} style={StyleSheet.absoluteFillObject as any} />

      <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':'height'}>
        <View style={styles.center}>
          <View style={styles.card}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.sub}>Enter your email to reset your password.</Text>

            <TextInput
              placeholder="Email address"
              placeholderTextColor={SUB}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />

            <TouchableOpacity disabled={loading} onPress={onSend} style={[styles.primaryBtn, loading && {opacity:0.6}]}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Send Reset Link</Text>}
            </TouchableOpacity>

            {/* Back button */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backText}>← Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex:1, alignItems:'center', justifyContent:'center', padding:20 },
  card: { width:'100%', backgroundColor: CARD, borderRadius:16, borderWidth:1, borderColor: OUT, padding:20 },
  title: { color: TEXT, fontWeight:'900', fontSize:24, marginBottom:6 },
  sub: { color: SUB, marginBottom:16 },
  input: { backgroundColor:'rgba(30,31,45,1)', color: TEXT, borderRadius:12, borderWidth:1, borderColor: OUT, padding:12, marginBottom:16 },
  primaryBtn: { backgroundColor: ACCENT, paddingVertical:14, borderRadius:12, alignItems:'center' },
  primaryText: { color:'#fff', fontWeight:'700' },
  backBtn: { marginTop:14, alignItems:'center' },
  backText: { color: SUB, fontWeight:'600' }
});
