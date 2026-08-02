import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import { Tabs } from "expo-router";
import { Image, StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabRow,
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
    bottom: 12,           
    marginHorizontal: 20, 
    borderRadius: 20,     
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