import { View, Text } from "react-native";
import { capitalize } from "@/lib/util";

type StreakInfoProps = {
    currentStreak: number;
    longestStreak: number;
    streakType: string;
};

const StreakInfo = ({
    currentStreak,
    longestStreak,
    streakType,
}: StreakInfoProps) => {
    return (
        <View className="mb-4 flex-col gap-2">
            <Text className="text-white font-dms-medium">
                🔥 Streak: {currentStreak} ({capitalize(streakType)})
            </Text>
            <Text className="text-white font-dms-medium">
                🏄🏻‍♂️ Longest: {longestStreak}
            </Text>
        </View>
    );
};

export default StreakInfo;
