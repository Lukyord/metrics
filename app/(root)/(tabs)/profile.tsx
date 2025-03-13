import { View, Text, SafeAreaView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { authService } from "@/services/auth";
import { useGlobalContext } from "@/context/global-provider";
import { icons } from "@/constant/icons";

const Profile = () => {
    const { user, refetch } = useGlobalContext();

    const handleLogout = async () => {
        const result = await authService.logout();

        if (result) {
            refetch({});
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-primary-100">
            <View className="flex-1 justify-center items-center p-10 gap-5">
                <Text className="text-xl font-dm-sans-bold">Profile</Text>

                <Image source={{ uri: user?.avatar }} className="size-44 relative rounded-full" />

                <Text className="text-2xl font-dm-sans-bold mt-2">{user?.name}</Text>

                <TouchableOpacity
                    onPress={handleLogout}
                    className="bg-white shadow-md shadow-zinc-300 rounded-full py-4 px-16"
                >
                    <View className="flex justify-center flex-row items-center">
                        <Image source={icons.Logout} className="w-5 h-5" resizeMode="contain" />

                        <Text className="text-lg font-rubik-medium text-black-300 ml-2">Logout</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Profile;
