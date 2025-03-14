import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import "@/styles/global.css";
import GlobalProvider from "@/context/global-provider";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        "DM-Sans-Bold": require("@/assets/fonts/DMSans-Bold.ttf"),
        "DM-Sans-Medium": require("@/assets/fonts/DMSans-Medium.ttf"),
        "DM-Sans-Regular": require("@/assets/fonts/DMSans-Regular.ttf"),
        "DM-Sans-SemiBold": require("@/assets/fonts/DMSans-SemiBold.ttf"),
        "DM-Sans-Thin": require("@/assets/fonts/DMSans-Thin.ttf"),
        "DM-Sans-Light": require("@/assets/fonts/DMSans-Light.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <GlobalProvider>
                    <Stack screenOptions={{ headerShown: false }} />
                </GlobalProvider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}
