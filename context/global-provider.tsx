import { useAppwrite } from "@/hooks/useAppwrite";
import React, { createContext } from "react";
import { authService } from "@/services/auth";

type User = {
    $id: string;
    name: string;
    email: string;
    avatar: string;
};

type GlobalContextType = {
    isLoggedIn: boolean;
    user: User | null;
    loading: boolean;
    refetch: (newParams: Record<string, string | number>) => Promise<void>;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const {
        data: user,
        loading,
        refetch,
    } = useAppwrite({
        fn: authService.getCurrentUser,
    });

    const isLoggedIn = !!user;

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                user: user ?? null,
                loading,
                refetch,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = React.useContext(GlobalContext);

    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalProvider");
    }

    return context;
};

export default GlobalProvider;
