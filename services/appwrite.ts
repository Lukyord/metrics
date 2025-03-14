import { Platform } from "react-native";
import { Account, Avatars, Client, Databases } from "react-native-appwrite";

export const config = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOTIN || "",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "",
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || "",
    metricsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_METRICS_COLLECTION_ID || "",
    subGoalsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_SUBGOALS_COLLECTION_ID || "",
};

export const client = new Client();

client.setEndpoint(config.endpoint).setProject(config.projectId);

switch (Platform.OS) {
    case "ios":
        client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_BUNDLE_ID || "");
        break;
    case "android":
        client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PACKAGE_NAME || "");
        break;
}

export const avatar = new Avatars(client);
export const account = new Account(client);
export const database = new Databases(client);
