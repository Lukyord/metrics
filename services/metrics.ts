import { config, database } from "@/services/appwrite";
import { MetricAppwrite } from "@/types/metrics-type";
import { AppwriteException, ID, Query } from "react-native-appwrite";

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
            const result = await database.listDocuments(config.databaseId, config.metricsCollectionId, [
                Query.equal("user_id", userId),
            ]);

            return result.documents;
        } catch (error) {
            console.error("Error getting metrics at metricsService: ", error);
            return [];
        }
    },
    async delete({ documentId }: { documentId: string }) {
        try {
            const result = await database.deleteDocument(config.databaseId, config.metricsCollectionId, documentId);
            return { success: true };
        } catch (error) {
            console.error("Error deleting metric at metricsService: ", error);
            return { error };
        }
    },
    async update({ documentId, data }: { documentId: string; data: Partial<MetricAppwrite> }) {
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
};
