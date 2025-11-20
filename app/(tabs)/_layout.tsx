import FontAwesome from "@expo/vector-icons/FontAwesome";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 50,
          width: 200,
          height: 70,
          borderRadius: 25,
          backgroundColor: "transparent",
          elevation: 0,
          shadowOpacity: 0,
          overflow: "hidden", // clip inner shadow
          shadowColor: "transparent", // remove iOS shadow glow
          borderColor: "transparent",
          shadowRadius: 0,
          marginLeft: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 6,
        },

        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarActiveTintColor: "#3067ffff", // green when selected
        tabBarInactiveTintColor: "gray", // gray when not selected
        tabBarBackground: () => (
          <BlurView
            intensity={20} // adjust blur strength (40–100 looks best)
            tint="light" // "light" | "dark" | "default"
            style={{ flex: 1, borderRadius: 25 }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="devices"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="devices" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
