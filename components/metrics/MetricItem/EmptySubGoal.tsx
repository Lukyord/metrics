import { View, Text } from "react-native";
import React from "react";

const EmptySubGoal = () => {
    return (
        <View className="mt-4">
            <Text className="text-center text-white text-xl font-dms-bold mb-2">
                No subgoals yet
            </Text>
        </View>
    );
};

export default EmptySubGoal;
