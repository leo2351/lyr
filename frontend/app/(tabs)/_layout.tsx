import { Stack } from 'expo-router';

export default function TabsLayout() {
  // Real bottom-tab navigator will be built alongside Home/Search/Reels/Profile screens.
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#05050A' },
      }}
    />
  );
}
