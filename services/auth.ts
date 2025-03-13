import { OAuthProvider } from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { account, avatar } from "@/services/appwrite";

export const authService = {
    async login() {
        try {
            const redirectUri = Linking.createURL("/");

            const response = await account.createOAuth2Token(OAuthProvider.Google, redirectUri);

            if (!response) throw new Error("Failed to login");

            const browserResult = await openAuthSessionAsync(response.toString(), redirectUri);

            if (browserResult.type !== "success") throw new Error("Failed to login");

            const url = new URL(browserResult.url);

            const secret = url.searchParams.get("secret")?.toString();
            const userId = url.searchParams.get("userId")?.toString();

            if (!secret || !userId) throw new Error("Failed to login");

            const session = await account.createSession(userId, secret);

            if (!session) throw new Error("Failed to create a session");

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },
    async logout() {
        try {
            await account.deleteSession("current");
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },
    async getCurrentUser() {
        try {
            const session = await account.getSession("current").catch(() => null);
            if (!session) return null;

            const response = await account.get();

            if (!response) throw new Error("Failed to get user");

            if (response.$id) {
                const userAvatar = await avatar.getInitials(response.name);

                return {
                    ...response,
                    avatar: userAvatar.toString(),
                };
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    },
};
