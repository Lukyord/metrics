import { useState } from "react";
import { Alert } from "react-native";
import { Models } from "react-native-appwrite";
import { metricsService } from "@/services/metrics";
import { subgoalsService } from "@/services/subgoals";
import { calculateStreak } from "@/lib/metrics";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export const useMetricActions = (
    item: Models.Document,
    refetch: () => void,
    bottomSheetModalRef: React.RefObject<BottomSheetModal>,
    setMetricItem: (updatedMetric: Models.Document) => void
) => {
    const [loadingSubgoals, setLoadingSubgoals] = useState<{
        [key: string]: boolean;
    }>({});
    const [editingSubgoal, setEditingSubgoal] =
        useState<Models.Document | null>(null);

    const handleEditSubGoal = (subgoal: Models.Document) => {
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
                        // Optimistic update
                        const updatedMetric = {
                            ...item,
                            subgoals: item.subgoals.filter(
                                (sg: Models.Document) => sg.$id !== subgoal.$id
                            ),
                        };
                        setMetricItem(updatedMetric);

                        // API Call
                        try {
                            const response = await subgoalsService.delete({
                                documentId: subgoal.$id,
                            });

                            if ("error" in response) {
                                setMetricItem(item);
                                console.error(
                                    "Failed to delete subgoal:",
                                    response.error
                                );
                            }
                        } catch (error) {
                            setMetricItem(item);
                            console.error("Error deleting subgoal:", error);
                        }
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

            if (item.streak_type) {
                const newStreak = calculateStreak(
                    item.streak_type,
                    new Date(item.last_completed_date),
                    item.current_streak,
                    true
                );

                item.current_streak = newStreak;
                item.longest_streak = Math.max(newStreak, item.longest_streak);
                item.last_completed_date = new Date().toISOString();
            }

            const subGoalResponse = await subgoalsService.update({
                documentId: subgoal.$id,
                data: {
                    progress: currentProgress + 1,
                },
            });

            if ("error" in subGoalResponse) {
                item.subgoals = item.subgoals.map((sg: Models.Document) =>
                    sg.$id === subgoal.$id ? subgoal : sg
                );
                console.error(
                    "Failed to increment progress:",
                    subGoalResponse.error
                );
            }

            const metricStreakResponse = await metricsService.recordCompletion({
                documentId: item.$id,
                completed: true,
            });

            if ("error" in metricStreakResponse) {
                console.error(
                    "Failed to update streak:",
                    metricStreakResponse.error
                );
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
    return {
        loadingSubgoals,
        editingSubgoal,
        setEditingSubgoal,
        handleEditSubGoal,
        handleDeleteSubgoal,
        handleDeleteMetric,
        handleIncrementProgress,
    };
};
