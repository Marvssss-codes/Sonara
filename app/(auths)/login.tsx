// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function Login() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {/* Real UI coming next; for now just navigation works */}
      <Link href="/(auth)/signup" asChild>
        <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>Go to Sign up</Text></TouchableOpacity>
      </Link>
      <Link href="/(tabs)" asChild>
        <TouchableOpacity style={[styles.btn, { backgroundColor:'#2ecc71' }]}><Text style={styles.btnText}>Skip to App</Text></TouchableOpacity>
      </Link>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0F0F10', alignItems:'center', justifyContent:'center', gap:12, padding:24 },
  title:{ color:'#ECEDEE', fontSize:26, fontWeight:'800', marginBottom:8 },
  btn:{ backgroundColor:'#8A5CF6', paddingVertical:12, paddingHorizontal:16, borderRadius:12 },
  btnText:{ color:'#fff', fontWeight:'700' }
});
