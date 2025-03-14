import React from "react";
import { View, Text, Image } from "react-native";
import { Tabs } from "expo-router";
import { icons } from "@/constant/icons";

const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: any; title: string }) => (
    <View className="flex-1 mt-3 flex flex-col items-center">
        <Image source={icon} tintColor={focused ? "#000000" : "#7f7f7f"} resizeMode="contain" className="size-6" />
        <Text className={`${focused ? "text-black" : "text-primary-400"} text-xs w-full text-center mt-1`}>
            {title}
        </Text>
    </View>
);

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: "white",
                    position: "absolute",
                    borderTopColor: "#0061ff1A",
                    borderTopWidth: 1,
                    minHeight: 17,
                    height: "10%",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    // headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon icon={icons.HouseBlank} focused={focused} title="Home" />,
                }}
            />
            <Tabs.Screen
                name="community"
                options={{
                    title: "Community",
                    // headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon icon={icons.Messages} focused={focused} title="Community" />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    // headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon icon={icons.Profile} focused={focused} title="Profile" />,
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
