// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const BG   = '#0F0F10';
const CARD = '#17181B';
const TEXT = '#ECEDEE';
const SUB  = '#A8ACB3';
const LINE = '#2A2B30';
const ACC  = '#8A5CF6';

const GENRES = ['Afrobeats','Hip-Hop','Pop','R&B','Gospel','Amapiano','Highlife','Alté','Reggae','Rock','Jazz','Dance/Electro'];

export default function ProfileSetup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male'|'female'|'other'|null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (g: string) => {
    setSelected(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const canContinue = name.trim() && Number(age) > 0 && gender && selected.length > 0;

  const onContinue = () => {
    if (!canContinue) return;
    // (Later) save to Supabase, then go to tabs
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={{ flex:1, backgroundColor: BG }} contentContainerStyle={{ padding:20, paddingTop:54 }}>
      <Text style={s.brand}>SONARA</Text>
      <Text style={s.title}>Complete your profile</Text>
      <Text style={s.sub}>Tell us a bit about you to personalize recommendations.</Text>

      <View style={s.card}>
        {/* Name */}
        <Text style={s.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your display name"
          placeholderTextColor={SUB}
          style={s.input}
        />

        {/* Age */}
        <Text style={s.label}>Age</Text>
        <TextInput
          value={age}
          onChangeText={setAge}
          placeholder="e.g. 18"
          placeholderTextColor={SUB}
          keyboardType="numeric"
          style={s.input}
        />

        {/* Gender */}
        <Text style={s.label}>Gender</Text>
        <View style={s.pillsRow}>
          {['male','female','other'].map(g => (
            <TouchableOpacity key={g} onPress={() => setGender(g as any)}
              style={[s.pill, gender===g && s.pillActive]}>
              <Text style={[s.pillText, gender===g && s.pillTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Genres */}
        <Text style={s.label}>Favorite genres</Text>
        <View style={s.genresWrap}>
          {GENRES.map(g => {
            const active = selected.includes(g);
            return (
              <TouchableOpacity key={g} onPress={() => toggle(g)} style={[s.genre, active && s.genreActive]}>
                <Text style={[s.genreText, active && s.genreTextActive]}>{g}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[s.primaryBtn, !canContinue && { opacity: 0.5 }]}
          activeOpacity={0.85}
          onPress={onContinue}
          disabled={!canContinue}
        >
          <Text style={s.primaryText}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  brand: { color: ACC, fontWeight:'800', letterSpacing: 2, marginBottom: 6 },
  title: { color: TEXT, fontSize: 26, fontWeight:'900' },
  sub: { color: SUB, marginTop: 4, marginBottom: 12 },
  card: { marginTop: 6, backgroundColor: CARD, borderRadius: 16, borderWidth: 1, borderColor: LINE, padding: 16 },
  label: { color: TEXT, marginTop: 10, marginBottom: 6, fontWeight: '700' },
  input: { backgroundColor: BG, color: TEXT, borderWidth: 1, borderColor: LINE, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12 },
  pillsRow: { flexDirection:'row', gap:10 },
  pill: { paddingVertical:10, paddingHorizontal:14, borderRadius:20, borderWidth:1, borderColor: LINE, backgroundColor: BG },
  pillActive: { backgroundColor: ACC, borderColor: ACC },
  pillText: { color: TEXT, textTransform:'capitalize', fontWeight:'600' },
  pillTextActive: { color:'#fff' },
  genresWrap: { flexDirection:'row', flexWrap:'wrap', gap:10 },
  genre: { paddingVertical:8, paddingHorizontal:12, borderRadius:18, borderWidth:1, borderColor: LINE, backgroundColor: BG },
  genreActive: { backgroundColor: '#222', borderColor: ACC },
  genreText: { color: TEXT, fontWeight:'600' },
  genreTextActive: { color: '#fff' },
  primaryBtn: { marginTop: 16, backgroundColor: ACC, paddingVertical: 14, borderRadius: 14, alignItems:'center' },
  primaryText: { color:'#fff', fontWeight:'800' },
});
