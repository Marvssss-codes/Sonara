import React from 'react';
import { Image } from 'expo-image';
import { ScrollView, View, Text, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabTwoScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#121212' }} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.headerRow}>
        <Ionicons name="code-slash" size={42} color="#808080" />
        <Text style={styles.headerText}>Explore</Text>
      </View>

      <Text style={styles.body}>This app includes example code to help you get started.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>File-based routing</Text>
        <Text style={styles.body}>This app has two screens: app/(tabs)/index.tsx and app/(tabs)/explore.jsx</Text>
        <Text style={styles.body}>The layout file in app/(tabs)/_layout.tsx sets up the tab navigator.</Text>
        <Text style={styles.link} onPress={() => Linking.openURL('https://docs.expo.dev/router/introduction')}>Learn more</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Images</Text>
        <Text style={styles.body}>For static images, you can use @2x and @3x suffixes for different screen densities.</Text>
        <Image source={require('@/assets/images/react-logo.png')} style={{ width: 100, height: 100, alignSelf: 'center' }} />
        <Text style={styles.link} onPress={() => Linking.openURL('https://reactnative.dev/docs/images')}>Learn more</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Light and dark mode</Text>
        <Text style={styles.body}>This template supports light and dark mode. Adjust your system theme to see changes.</Text>
        <Text style={styles.link} onPress={() => Linking.openURL('https://docs.expo.dev/develop/user-interface/color-themes/')}>Learn more</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  headerText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  body: { color: '#ccc', marginBottom: 8 },
  card: { backgroundColor: '#1b1b1b', borderRadius: 12, padding: 12, marginTop: 12 },
  cardTitle: { color: '#fff', fontWeight: '700', marginBottom: 6 },
  link: { color: '#1DB954', marginTop: 6 },
});


