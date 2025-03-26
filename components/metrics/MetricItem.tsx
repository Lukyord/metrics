import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    FlatList,
    ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
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
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { icons } from "@/constant/icons";
import { metricsService } from "@/services/metrics";
import { subgoalsService } from "@/services/subgoals";
import SubGoalBottomSheetModal from "./SubGoalBottomSheetModal";

type MetricItemProps = {
    item: Models.Document;
    onEdit: () => void;
    refetch: () => void;
};

const MetricItem = ({ item, onEdit, refetch }: MetricItemProps) => {
    const metricItemRef = useAnimatedRef();
    const heightValue = useSharedValue(0);
    const open = useSharedValue(true);
    const progress = useDerivedValue(() =>
        open.value ? withTiming(1) : withTiming(0)
    );
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [editingSubgoal, setEditingSubgoal] =
        useState<Models.Document | null>(null);
    const [loadingSubgoals, setLoadingSubgoals] = useState<{
        [key: string]: boolean;
    }>({});

    const heightAnimationStyle = useAnimatedStyle(() => ({
        height: heightValue.value,
    }));

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${progress.value * 180}deg` }],
    }));

    const updateHeight = useCallback(() => {
        runOnUI(() => {
            "worklet";
            if (open.value) {
                const measuredHeight = measure(metricItemRef)?.height ?? 0;
                heightValue.value = withTiming(measuredHeight);
            }
        })();
    }, [open.value]);

    useEffect(() => {
        updateHeight();
    }, [updateHeight, item.subgoals.length]);

    const handleEditSubgoal = (subgoal: Models.Document) => {
        setEditingSubgoal(subgoal);
        bottomSheetModalRef.current?.present();
    };

    const handleDeleteSubgoal = async (subgoal: Models.Document) => {
        Alert.alert(
            "Delete Subgoal",
            "Are you sure you want to delete this subgoal?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const response = await subgoalsService.delete({
                            documentId: subgoal.$id,
                        });

                        if ("error" in response) {
                            console.error(
                                "Failed to delete subgoal:",
                                response.error
                            );
                        }

                        refetch();
                    },
                },
            ]
        );
    };

    const handleDeleteMetric = async () => {
        Alert.alert(
            "Delete Metric",
            "Are you sure you want to delete this metric?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const response = await metricsService.delete({
                            documentId: item.$id,
                        });

                        if ("error" in response) {
                            console.error(
                                "Failed to delete metric:",
                                response.error
                            );
                            return;
                        }

                        refetch();
                    },
                },
            ]
        );
    };

    const handleIncrementProgress = async (subgoal: Models.Document) => {
        try {
            setLoadingSubgoals((prev) => ({ ...prev, [subgoal.$id]: true }));
            const currentProgress = subgoal.progress || 0;

            const optimisticSubgoal = {
                ...subgoal,
                progress: currentProgress + 1,
            };

            item.subgoals = item.subgoals.map((sg: Models.Document) =>
                sg.$id === subgoal.$id ? optimisticSubgoal : sg
            );

            const response = await subgoalsService.update({
                documentId: subgoal.$id,
                data: {
                    progress: currentProgress + 1,
                },
            });

            if ("error" in response) {
                item.subgoals = item.subgoals.map((sg: Models.Document) =>
                    sg.$id === subgoal.$id ? subgoal : sg
                );
                console.error("Failed to increment progress:", response.error);
            }
        } catch (error) {
            item.subgoals = item.subgoals.map((sg: Models.Document) =>
                sg.$id === subgoal.$id ? subgoal : sg
            );
            console.error("Error incrementing progress:", error);
        } finally {
            setLoadingSubgoals((prev) => ({ ...prev, [subgoal.$id]: false }));
        }
    };

    return (
        <View className="bg-gray-700 px-4 py-2 rounded-xl mt-2 overflow-hidden">
            <TouchableOpacity
                onPress={() => {
                    if (heightValue.value === 0) {
                        runOnUI(() => {
                            "worklet";
                            heightValue.value = withTiming(
                                measure(metricItemRef)!.height
                            );
                        })();
                    } else {
                        heightValue.value = withTiming(0);
                    }

                    open.value = !open.value;
                }}
            >
                <View className="flex flex-row items-center justify-between gap-4 p-3 h-[50px]">
                    <View className="flex flex-row gap-4 items-center">
                        <Text className="text-xl font-dm-sans-bold text-white">
                            {item.name}
                        </Text>
                    </View>
                    <Animated.View style={iconStyle}>
                        <Image
                            source={icons.TriangleDown}
                            className="w-4 h-4"
                            tintColor="#fff"
                        />
                    </Animated.View>
                </View>
            </TouchableOpacity>

            <Animated.View style={heightAnimationStyle}>
                <Animated.View
                    ref={metricItemRef}
                    className="p-4 absolute top-100%"
                >
                    {item.subgoals.length > 0 ? (
                        <View className="">
                            <FlatList
                                data={item.subgoals}
                                keyExtractor={(subgoal) => subgoal.$id}
                                renderItem={({ item: subgoal }) => (
                                    <View className="bg-gray-100 p-2 rounded-md mb-2">
                                        <View className="flex-row justify-between items-center">
                                            <View>
                                                <Text className="font-dms-medium">
                                                    {subgoal.name}
                                                </Text>
                                                <Text className="text-gray-600">
                                                    Progress: {subgoal.progress}{" "}
                                                    {subgoal.unit}
                                                </Text>
                                            </View>

                                            <TouchableOpacity
                                                onPress={() =>
                                                    handleIncrementProgress(
                                                        subgoal
                                                    )
                                                }
                                                className="bg-primary-200 px-2 py-1 rounded-full"
                                                disabled={
                                                    loadingSubgoals[subgoal.$id]
                                                }
                                            >
                                                {loadingSubgoals[
                                                    subgoal.$id
                                                ] ? (
                                                    <ActivityIndicator
                                                        size="small"
                                                        color="#fff"
                                                    />
                                                ) : (
                                                    <Text className="text-white font-dms-medium">
                                                        ➕
                                                    </Text>
                                                )}
                                            </TouchableOpacity>
                                        </View>

                                        <View className="flex-row gap-2 mt-2">
                                            <TouchableOpacity
                                                onPress={() =>
                                                    handleDeleteSubgoal(subgoal)
                                                }
                                                className="bg-primary-200 px-2 py-1 rounded-full"
                                            >
                                                <Text className="text-white font-dms-medium">
                                                    🗑️
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    handleEditSubgoal(subgoal)
                                                }
                                                className="bg-primary-200 px-2 py-1 rounded-full"
                                            >
                                                <Text className="text-white font-dms-medium">
                                                    👨🏻‍💻 Edit
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    ) : (
                        <View className="mt-4">
                            <Text className="text-center text-white text-xl font-dms-bold mb-2">
                                No subgoals yet
                            </Text>
                        </View>
                    )}

                    <View className="w-full flex flex-row items-center justify-end mt-6 gap-2">
                        <TouchableOpacity
                            onPress={() =>
                                bottomSheetModalRef.current?.present()
                            }
                            className="bg-gray-300 p-3 rounded-full"
                        >
                            <Text className="text-black font-dms-medium text-xl">
                                🚩 Add Subgoal
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onEdit}
                            className="bg-gray-300 p-3 rounded-full"
                        >
                            <Text className="text-xl">✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleDeleteMetric}
                            className="bg-gray-300 p-3 rounded-full"
                        >
                            <Text className="text-xl">🗑️</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>

            <SubGoalBottomSheetModal
                ref={bottomSheetModalRef}
                editSubgoal={editingSubgoal}
                setEditingSubgoal={setEditingSubgoal}
                onSubgoalCreated={refetch}
                metricId={item.$id}
            />
        </View>
    );
};

export default MetricItem;
