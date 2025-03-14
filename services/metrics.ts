import { config, database } from "@/services/appwrite";
import { AppwriteException } from "react-native-appwrite";

export const metricsService = {
    async create(documentId: string, data: any) {
        try {
            const result = await database.createDocument(
                config.databaseId,
                config.metricsCollectionId,
                documentId,
                data
            );
            return result;
        } catch (error) {
            console.error("Error creating metric: ", error);
            return null;
        }
    },
};
