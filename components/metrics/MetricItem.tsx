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

import SubGoalBottomSheetModal from "./SubGoalBottomSheetModal";
import StreakInfo from "@/components/metrics/MetricItem/StreakInfo";
import MetricActionFooter from "./MetricItem/MetricItemActionFooter";
import SubgoalItem from "./MetricItem/SubGoalItem";
import MetricHeader from "./MetricItem/MetricHeader";
import EmptySubGoal from "./MetricItem/EmptySubGoal";
import { useMetricActions } from "@/hooks/useMetricActions";

type MetricItemProps = {
    item: Models.Document;
    onEdit: () => void;
    refetch: () => void;
};

const MetricItem = ({ item, onEdit, refetch }: MetricItemProps) => {
    const [metricItem, setMetricItem] = useState(item);
    const metricItemRef = useAnimatedRef();
    const heightValue = useSharedValue(0);
    const open = useSharedValue(true);
    const progress = useDerivedValue(() =>
        open.value ? withTiming(1) : withTiming(0)
    );
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const {
        loadingSubgoals,
        editingSubgoal,
        setEditingSubgoal,
        handleDeleteSubgoal,
        handleDeleteMetric,
        handleIncrementProgress,
        handleEditSubGoal,
    } = useMetricActions(
        metricItem,
        refetch,
        bottomSheetModalRef,
        setMetricItem
    );

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
    }, [updateHeight, metricItem]);

    return (
        <View className="bg-gray-700 px-4 py-2 rounded-xl mt-2 overflow-hidden">
            <MetricHeader
                heightValue={heightValue}
                open={open}
                metricItemRef={metricItemRef}
                iconStyle={iconStyle}
                onPress={() => {}}
                item={metricItem}
            />

            <Animated.View style={heightAnimationStyle}>
                <Animated.View
                    ref={metricItemRef}
                    className="p-4 absolute top-100%"
                >
                    <StreakInfo
                        currentStreak={metricItem.current_streak}
                        longestStreak={metricItem.longest_streak}
                        streakType={metricItem.streak_type}
                    />

                    {metricItem.subgoals.length > 0 ? (
                        <View className="">
                            <FlatList
                                data={metricItem.subgoals}
                                keyExtractor={(subgoal) => subgoal.$id}
                                renderItem={({ item: subgoal }) => (
                                    <SubgoalItem
                                        subgoal={subgoal}
                                        loading={loadingSubgoals[subgoal.$id]}
                                        onIncrement={handleIncrementProgress}
                                        onDelete={handleDeleteSubgoal}
                                        onEdit={handleEditSubGoal}
                                    />
                                )}
                            />
                        </View>
                    ) : (
                        <EmptySubGoal />
                    )}

                    <MetricActionFooter
                        onAddSubgoal={() =>
                            bottomSheetModalRef.current?.present()
                        }
                        onEdit={onEdit}
                        onDelete={handleDeleteMetric}
                    />
                </Animated.View>
            </Animated.View>

            <SubGoalBottomSheetModal
                metricItem={metricItem}
                ref={bottomSheetModalRef}
                editSubgoal={editingSubgoal}
                setEditingSubgoal={setEditingSubgoal}
                refetchMetric={refetch}
                metricId={metricItem.$id}
                onMetricUpdate={setMetricItem}
            />
        </View>
    );
};

export default MetricItem;
