import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { Redirect } from "expo-router";

import { images } from "@/constant/images";
import { icons } from "@/constant/icons";

import { useGlobalContext } from "@/context/global-provider";
import { authService } from "@/services/auth";

const SignIn = () => {
    const { refetch, loading, isLoggedIn } = useGlobalContext();

    if (!loading && isLoggedIn) {
        return <Redirect href="/" />;
    }

    const handleLogin = async () => {
        const result = await authService.login();

        if (result) {
            refetch({});
        } else {
            Alert.alert("Failed to login");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center p-5">
            <Image source={images.Logo} className="w-[30vw] h-[30vw]" />
            <Text className="text-2xl font-dm-sans-bold mt-4">Welcome to Metrics</Text>

            <TouchableOpacity
                onPress={handleLogin}
                className="bg-white shadow-md shadow-zinc-300 rounded-full px-16 py-4 mt-10"
            >
                <View className="flex justify-center flex-row items-center gap-5">
                    <Image source={icons.Google} className="w-5 h-5" resizeMode="contain" />
                    <Text className="text-lg font-rubik-medium text-black-300">Continue with Google</Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default SignIn;
