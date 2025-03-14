import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    Button,
    FlatList,
    ActivityIndicator,
} from "react-native";

import { icons } from "@/constant/icons";
import { metricsService } from "@/services/metrics";
import CreateMetricButton from "@/components/metrics/CreateMetricButton";
import CreateMetricButtomSheetModal from "@/components/metrics/CreateMetricButtomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAppwrite } from "@/hooks/useAppwrite";
import { useGlobalContext } from "@/context/global-provider";
import NoResult from "@/components/ui/NoResult";

const Metrics = () => {
    const { user } = useGlobalContext();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const {
        data: metrics,
        loading: metricsLoading,
        refetch: metricsRefetch,
    } = useAppwrite({
        fn: metricsService.get,
        params: {
            userId: user?.$id ?? "",
        },
    });

    return (
        <SafeAreaView className="flex-1 bg-primary-100 relative p-5">
            <FlatList
                data={metrics}
                className="w-full"
                contentContainerClassName="pb-32 p-5"
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View className="flex flex-col gap-5 items-center my-4">
                        <Text className="text-2xl font-dm-sans-bold">Metrics</Text>
                    </View>
                }
                ListEmptyComponent={
                    metricsLoading ? (
                        <ActivityIndicator size="large" className="color-primary-300 mt-5 w-full mx-auto" />
                    ) : (
                        <NoResult />
                    )
                }
                renderItem={({ item }) => (
                    <View className="bg-gray-700 px-4 py-4 rounded-lg mt-2">
                        <Text className="text-xl font-dm-sans-bold text-white">{item.name}</Text>
                    </View>
                )}
            />

            {/* Create Metric */}
            <CreateMetricButton onPress={() => bottomSheetModalRef.current?.present()} />
            <CreateMetricButtomSheetModal
                ref={bottomSheetModalRef}
                onMetricCreated={() => metricsRefetch({ userId: user?.$id ?? "" })}
            />
        </SafeAreaView>
    );
};

export default Metrics;
