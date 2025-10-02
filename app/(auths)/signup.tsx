// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function Signup() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <Link href="/(auth)/login" asChild>
        <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>Back to Login</Text></TouchableOpacity>
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
