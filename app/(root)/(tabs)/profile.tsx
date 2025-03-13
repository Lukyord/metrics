import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import { authService } from "@/services/auth";
import { useGlobalContext } from "@/context/global-provider";

const Profile = () => {
    const { refetch } = useGlobalContext();

    const handleLogout = async () => {
        const result = await authService.logout();

        if (result) {
            refetch({});
        }
    };
    
    return (
        <SafeAreaView>
             <TouchableOpacity
                onPress={handleLogout}
                className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-10"
            >
                <View className="flex justify-center flex-row items-center">
                    <Text className="text-lg font-rubik-medium text-black-300 ml-2">Logout</Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Profile;
