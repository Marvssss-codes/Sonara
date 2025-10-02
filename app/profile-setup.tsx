// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

const BG_TOP = '#0E0F1A';
const BG_BOT = '#0A0B12';
const CARD   = 'rgba(18,19,30,0.9)';
const TEXT   = '#EDEFF6';
const SUB    = '#9AA0AE';
const OUT    = '#2A2D3A';
const PILL   = '#141626';
const ACCENT = '#8A5CF6';

const GENRES = ['Afrobeats','Hip-Hop','Pop','R&B','Gospel','Amapiano','Highlife','Alté','Reggae','Rock','Jazz','Dance/Electro'];

export default function ProfileSetup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male'|'female'|'other'|null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggle = (g: string) => {
    setSelected(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const canContinue = name.trim() && Number(age) > 0 && gender && selected.length > 0;

  const onSave = async () => {
    if (!canContinue || saving) return;
    setSaving(true);
    try {
      const { data: { session }, error: sessErr } = await supabase.auth.getSession();
      if (sessErr) throw sessErr;
      if (!session) {
        Alert.alert('Session expired', 'Please log in again.');
        router.replace('/(auth)/login');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          name: name.trim(),
          age: Number(age),
          gender,
          favorite_genres: selected,
        })
        .eq('id', session.user.id);

      if (error) {
        Alert.alert('Could not save', error.message);
        return;
      }

      // Success → go to app
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex:1 }}>
      <LinearGradient colors={[BG_TOP, BG_BOT]} style={StyleSheet.absoluteFillObject as any} />
      <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':'height'}>
        <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
          <Text style={styles.kicker}>SONARA</Text>
          <Text style={styles.title}>Tell us about you</Text>
          <Text style={styles.sub}>We’ll personalize your feed based on age and taste.</Text>

          {/* Card: Basic info */}
          <View style={styles.card}>
            <Text style={styles.section}>Basic info</Text>

            <Text style={styles.label}>Display name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g., Marv"
              placeholderTextColor={SUB}
              style={styles.input}
            />

            <Text style={styles.label}>Age</Text>
            <TextInput
              value={age}
              onChangeText={setAge}
              placeholder="e.g., 18"
              placeholderTextColor={SUB}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text style={styles.label}>Gender</Text>
            <View style={styles.pillsRow}>
              {['male','female','other'].map(g => {
                const active = gender===g;
                return (
                  <TouchableOpacity key={g} onPress={()=>setGender(g as any)} style={[styles.pill, active && styles.pillActive]}>
                    <Text style={[styles.pillText, active && styles.pillTextActive]}>{g}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Card: Genres */}
          <View style={styles.card}>
            <Text style={styles.section}>Favorite genres</Text>
            <View style={styles.genresWrap}>
              {GENRES.map(g => {
                const active = selected.includes(g);
                return (
                  <TouchableOpacity key={g} onPress={() => toggle(g)} style={[styles.genre, active && styles.genreActive]}>
                    <Text style={[styles.genreText, active && styles.genreTextActive]}>{g}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity
            disabled={!canContinue || saving}
            onPress={onSave}
            activeOpacity={0.9}
            style={[styles.primaryBtn, (!canContinue || saving) && { opacity:0.6 }]}
          >
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Save & Continue</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexGrow:1, padding:20, paddingTop:34 },
  kicker: { color:'#8B90A7', letterSpacing:2, fontWeight:'800', marginBottom:6 },
  title: { color: TEXT, fontWeight:'900', fontSize:26 },
  sub: { color: SUB, marginTop:4, marginBottom:10 },

  card: { backgroundColor: CARD, borderRadius:16, borderWidth:1, borderColor: OUT, padding:16, marginTop:12 },
  section: { color: TEXT, fontWeight:'800', marginBottom:8, opacity:0.95 },

  label: { color: TEXT, marginTop:10, marginBottom:6, fontWeight:'700', opacity:0.9 },
  input: { backgroundColor: PILL, color: TEXT, borderWidth:1, borderColor: OUT, borderRadius:12, paddingHorizontal:12, paddingVertical:12 },

  pillsRow: { flexDirection:'row', gap:10 },
  pill: { paddingVertical:10, paddingHorizontal:14, borderRadius:20, borderWidth:1, borderColor: OUT, backgroundColor: PILL },
  pillActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  pillText: { color: TEXT, textTransform:'capitalize', fontWeight:'600' },
  pillTextActive: { color:'#fff' },

  genresWrap: { flexDirection:'row', flexWrap:'wrap', gap:10 },
  genre: { paddingVertical:8, paddingHorizontal:12, borderRadius:18, borderWidth:1, borderColor: OUT, backgroundColor: PILL },
  genreActive: { backgroundColor:'#222', borderColor: ACCENT },
  genreText: { color: TEXT, fontWeight:'600' },
  genreTextActive: { color:'#fff' },

  primaryBtn: { marginTop:16, backgroundColor: ACCENT, paddingVertical:14, borderRadius:14, alignItems:'center' },
  primaryText: { color:'#fff', fontWeight:'800' },
});
