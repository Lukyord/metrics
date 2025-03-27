import { calculateStreak } from "@/lib/metrics";
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
};
