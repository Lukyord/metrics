import { calculateStreak, getWeekNumber } from "@/lib/metrics";
import { config, database } from "@/services/appwrite";
import { MetricAppwrite, StreakType } from "@/types/metrics-type";
import { ID, Query } from "react-native-appwrite";

export const metricsService = {
    async create({ data }: { data: MetricAppwrite }) {
        try {
            const result = await database.createDocument(
                config.databaseId,
                config.metricsCollectionId,
                ID.unique(),
                data
            );
            return result;
        } catch (error) {
            console.error("Error creating metric at metricsService: ", error);
            return { error: error };
        }
    },
    async get({ userId }: { userId: string }) {
        try {
            const result = await database.listDocuments(
                config.databaseId,
                config.metricsCollectionId,
                [Query.equal("user_id", userId)]
            );

            return result.documents;
        } catch (error) {
            console.error("Error getting metrics at metricsService: ", error);
            return [];
        }
    },
    async delete({ documentId }: { documentId: string }) {
        try {
            const result = await database.deleteDocument(
                config.databaseId,
                config.metricsCollectionId,
                documentId
            );
            return { success: true };
        } catch (error) {
            console.error("Error deleting metric at metricsService: ", error);
            return { error };
        }
    },
    async update({
        documentId,
        data,
    }: {
        documentId: string;
        data: Partial<MetricAppwrite>;
    }) {
        try {
            const result = await database.updateDocument(
                config.databaseId,
                config.metricsCollectionId,
                documentId,
                data
            );
            return result;
        } catch (error) {
            console.error("Error updating metric at metricsService: ", error);
            return { error };
        }
    },
    async recordCompletion({
        documentId,
        completed,
    }: {
        documentId: string;
        completed: boolean;
    }) {
        try {
            const today = new Date().toISOString();
            const metric = await database.getDocument(
                config.databaseId,
                config.metricsCollectionId,
                documentId
            );

            if (!metric.streak_type) return { success: true };

            const completionHistory = JSON.parse(
                metric.completion_history || "[]"
            );
            completionHistory.push({ date: today, completed });

            const streakType = metric.streak_type as StreakType;
            const lastCompletedDate = metric.last_completed_date
                ? new Date(metric.last_completed_date)
                : new Date();
            const currentStreak = calculateStreak(
                streakType,
                lastCompletedDate,
                metric.current_streak,
                completed
            );

            const result = await database.updateDocument(
                config.databaseId,
                config.metricsCollectionId,
                documentId,
                {
                    current_streak: currentStreak,
                    longest_streak: Math.max(
                        currentStreak,
                        metric.longest_streak
                    ),
                    last_completed_date: today,
                    completion_history: JSON.stringify(completionHistory),
                }
            );
            return result;
        } catch (error) {
            console.error(
                "Error recording completion at metricsService: ",
                error
            );
            return { error };
        }
    },
    async checkAndUpdateStreaks() {
        try {
            // Get all metrics with streaks
            const metrics = await database.listDocuments(
                config.databaseId,
                config.metricsCollectionId,
                [Query.notEqual("streak_type", "no-streak")]
            );

            const today = new Date();
            const updates = metrics.documents.map(async (metric) => {
                const lastCompletedDate = new Date(metric.last_completed_date);
                const streakType = metric.streak_type as StreakType;

                // Calculate if streak should be maintained
                const shouldMaintainStreak = (() => {
                    switch (streakType) {
                        case "daily": {
                            const diffInDays = Math.floor(
                                (today.getTime() -
                                    lastCompletedDate.getTime()) /
                                    (1000 * 60 * 60 * 24)
                            );
                            return diffInDays <= 1;
                        }
                        case "weekly": {
                            const weekDiff =
                                getWeekNumber(today) -
                                getWeekNumber(lastCompletedDate);
                            return weekDiff <= 1;
                        }
                        case "monthly": {
                            const thisMonth =
                                today.getMonth() + today.getFullYear() * 12;
                            const lastMonth =
                                lastCompletedDate.getMonth() +
                                lastCompletedDate.getFullYear() * 12;
                            return thisMonth - lastMonth <= 1;
                        }
                        case "annually": {
                            const yearDiff =
                                today.getFullYear() -
                                lastCompletedDate.getFullYear();
                            return yearDiff <= 1;
                        }
                        default:
                            return false;
                    }
                })();

                // If streak should not be maintained, reset it to 0
                if (!shouldMaintainStreak) {
                    return database.updateDocument(
                        config.databaseId,
                        config.metricsCollectionId,
                        metric.$id,
                        {
                            current_streak: 0,
                        }
                    );
                }
            });

            await Promise.all(updates.filter(Boolean));
            return { success: true };
        } catch (error) {
            console.error("Error checking streaks at metricsService: ", error);
            return { error };
        }
    },
};
