import { images } from "@/constants/images";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
          height: 70,
        },

        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#888",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: focused ? 2 : 0,
                borderColor: "#3B82F6",
              }}
            >
              <Image
                source={images.home}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="voca"
        options={{
          title: "Voca",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: focused ? 2 : 0,
                borderColor: "#3B82F6",
              }}
            >
              <Image
                source={images.voca}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}