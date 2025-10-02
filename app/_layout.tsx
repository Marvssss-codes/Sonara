// @ts-nocheck
import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Pre-tabs flow */}
      <Stack.Screen name="splash" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(auth)" />
      {/* Tabs app */}
      <Stack.Screen name="(tabs)" />
      {/* Not-found keeps working */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
