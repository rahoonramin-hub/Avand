import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import { Tabs } from "expo-router";
import { Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets()
  //let barHeight = insets+50
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabRow,{bottom: insets.bottom+12}],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused? images.homeH : images.home}
              style={styles.icon}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="voca"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused? images.vocaH : images.voca}
              style={styles.icon}
            />
          ),
        }}
      />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  tabRow:{
    backgroundColor: colors.dark.bg, 
    position: 'absolute', 
    paddingBottom: 0,
    marginHorizontal: 20, 
    borderRadius: 20,     
    height: 70,
    borderColor: colors.dark.border,
    borderWidth: 1,
    borderTopWidth: 1,
    paddingTop:12,
    elevation: 0,      
  },
  icon:{
    width: 48,
    height: 48,
  },
})