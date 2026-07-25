import { Stack } from "expo-router";
import * as Updates from "expo-updates";
import { useEffect } from "react";
import { I18nManager } from "react-native";

export default function RootLayout() {
  useEffect(() => {
    async function checkRTL() {
      if (I18nManager.isRTL) {
        I18nManager.allowRTL(false);
        I18nManager.forceRTL(false);
        await Updates.reloadAsync();
      }
    }

    checkRTL();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}