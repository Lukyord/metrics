import { config, database } from "@/services/appwrite";
import { SubgoalAppwrite } from "@/types/metrics-type";
import { ID, Query } from "react-native-appwrite";

export const subgoalsService = {
    async create({ data }: { data: SubgoalAppwrite }) {
        try {
            const result = await database.createDocument(
                config.databaseId,
                config.subGoalsCollectionId,
                ID.unique(),
                data
            );
            return result;
        } catch (error) {
            console.error("Error creating subgoal at subgoalsService: ", error);
            return { error: error };
        }
    },
    async get({ metricId }: { metricId: string }) {
        try {
            const result = await database.listDocuments(
                config.databaseId,
                config.subGoalsCollectionId,
                [Query.equal("metric_id", metricId)]
            );

            return result.documents;
        } catch (error) {
            console.error("Error getting subgoals at subgoalsService: ", error);
            return [];
        }
    },
    async getSubgoal({ documentId }: { documentId: string }) {
        try {
            const result = await database.getDocument(
                config.databaseId,
                config.subGoalsCollectionId,
                documentId
            );
            return result;
        } catch (error) {
            console.error("Error getting subgoal at subgoalsService: ", error);
            return { error };
        }
    },
    async delete({ documentId }: { documentId: string }) {
        try {
            const result = await database.deleteDocument(
                config.databaseId,
                config.subGoalsCollectionId,
                documentId
            );
            return { success: true };
        } catch (error) {
            console.error("Error deleting subgoal at subgoalsService: ", error);
            return { error };
        }
    },
    async update({
        documentId,
        data,
    }: {
        documentId: string;
        data: Partial<SubgoalAppwrite>;
    }) {
        try {
            const result = await database.updateDocument(
                config.databaseId,
                config.subGoalsCollectionId,
                documentId,
                data
            );
            return result;
        } catch (error) {
            console.error("Error updating subgoal at subgoalsService: ", error);
            return { error };
        }
    },
};
