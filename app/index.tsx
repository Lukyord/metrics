import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-2xl font-bold text-red-500 font-dm-sans-bold">
                Edit app/index.tsx to edit this screen.
            </Text>
            <Link href="/sign-in" className="font-dm-sans-medium">
                Sign In
            </Link>
            <Link href="/community">Community</Link>
            <Link href="/profile">Profile</Link>
        </View>
    );
}
