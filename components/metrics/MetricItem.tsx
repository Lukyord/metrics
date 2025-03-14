import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Models } from "react-native-appwrite";
import Animated, {
    useAnimatedRef,
    useSharedValue,
    useAnimatedStyle,
    runOnUI,
    measure,
    useDerivedValue,
    withTiming,
} from "react-native-reanimated";
import { icons } from "@/constant/icons";
import { metricsService } from "@/services/metrics";

type MetricItemProps = {
    item: Models.Document;
    onDelete: () => void;
    onEdit: () => void;
};

const MetricItem = ({ item, onDelete, onEdit }: MetricItemProps) => {
    const metricItemRef = useAnimatedRef();
    const heightValue = useSharedValue(0);
    const open = useSharedValue(true);
    const progress = useDerivedValue(() => (open.value ? withTiming(1) : withTiming(0)));

    const heightAnimationStyle = useAnimatedStyle(() => ({
        height: heightValue.value,
    }));

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${progress.value * 180}deg` }],
    }));

    useEffect(() => {
        runOnUI(() => {
            "worklet";
            const measuredHeight = measure(metricItemRef)?.height ?? 0;
            heightValue.value = measuredHeight;
        })();
    }, []);

    const handleDelete = async () => {
        Alert.alert("Delete Metric", "Are you sure you want to delete this metric?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    const response = await metricsService.delete({ documentId: item.$id });

                    if ("error" in response) {
                        console.error("Failed to delete metric:", response.error);
                        return;
                    }

                    onDelete();
                },
            },
        ]);
    };

    return (
        <View className="bg-gray-700 px-4 py-2 rounded-xl mt-2 overflow-hidden">
            <TouchableOpacity
                onPress={() => {
                    if (heightValue.value === 0) {
                        runOnUI(() => {
                            "worklet";
                            heightValue.value = withTiming(measure(metricItemRef)!.height);
                        })();
                    } else {
                        heightValue.value = withTiming(0);
                    }

                    open.value = !open.value;
                }}
            >
                <View className="flex flex-row items-center justify-between gap-4 p-3 h-[50px]">
                    <View className="flex flex-row gap-4 items-center">
                        <Text className="text-xl font-dm-sans-bold text-white">{item.name}</Text>
                    </View>
                    <Animated.View style={iconStyle}>
                        <Image source={icons.TriangleDown} className="w-4 h-4" tintColor="#fff" />
                    </Animated.View>
                </View>
            </TouchableOpacity>

            <Animated.View style={heightAnimationStyle}>
                <Animated.View ref={metricItemRef} className="p-4 absolute top-100%">
                    <Text className="text-sm  text-white">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit
                        amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur
                        adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Quisquam, quos.
                    </Text>

                    <View className="flex flex-row items-center justify-end mt-6 gap-2">
                        <TouchableOpacity onPress={onEdit} className="bg-gray-300 p-3 rounded-full">
                            <Text className="text-xl">✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} className="bg-gray-300 p-3 rounded-full">
                            <Text className="text-xl">🗑️</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </View>
    );
};

export default MetricItem;
