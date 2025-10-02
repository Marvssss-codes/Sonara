// @ts-nocheck
import { Redirect } from 'expo-router';

export default function Index() {
  // start the app at the Splash screen
  return <Redirect href="/splash" />;
}
