import { Stack } from 'expo-router';
import UserLocationProvider from './context/userLocation';

export default function RootLayout() {
  return (
    <UserLocationProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="launch" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="home" options={{ headerShown: false, gestureEnabled: false }} />
      </Stack>
    </UserLocationProvider>
  );
}