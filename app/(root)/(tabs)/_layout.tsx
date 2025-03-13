import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { images } from "@/constant/images";

const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: any; title: string }) => (
    <View className="flex-1 mt-3 flex flex-col items-center">
        <Image source={icon} tintColor={focused ? "#0061ff" : "#666876"} resizeMode="contain" className="size-6" />
        <Text
            className={`${
                focused ? "text-primary-300 font-rubik-medium" : "text-black-100 font-rubik"
            } text-xs w-full text-center mt-1`}
        >
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
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon icon={images.Logo} focused={focused} title="Home" />,
                }}
            />
            <Tabs.Screen
                name="community"
                options={{
                    title: "Community",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon icon={images.Logo} focused={focused} title="Community" />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon icon={images.Logo} focused={focused} title="Profile" />,
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
