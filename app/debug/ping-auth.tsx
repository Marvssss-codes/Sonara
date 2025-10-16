// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function PingAuth() {
  const [out, setOut] = useState('Checking...');

  useEffect(() => {
    (async () => {
      try {
        const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
        const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

        let log = `URL: ${url}\nKEY: ${key ? key.slice(0,8)+'...' : 'MISSING'}\n\n`;

        // call Supabase auth settings endpoint directly
        const res = await fetch(`${url}/auth/v1/settings`, {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
        });

        log += `HTTP: ${res.status}\n`;
        const body = await res.text();
        log += `Body: ${body.slice(0,400)}\n`;
        setOut(log);
      } catch (e: any) {
        setOut(`EXCEPTION: ${e?.message}\nSTACK: ${(e?.stack||'').slice(0,400)}`);
      }
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Text style={s.txt}>{out}</Text>
    </ScrollView>
  );
}
const s = StyleSheet.create({ wrap:{flexGrow:1, padding:16}, txt:{color:'#fff', fontFamily: 'monospace'} });
