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
import MetricButtomSheetModal from "@/components/metrics/MetricButtomSheetModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAppwrite } from "@/hooks/useAppwrite";
import { useGlobalContext } from "@/context/global-provider";
import NoResult from "@/components/ui/NoResult";
import MetricItem from "@/components/metrics/MetricItem";
import { Models } from "react-native-appwrite";

const Metrics = () => {
    const { user } = useGlobalContext();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [editingMetric, setEditingMetric] = useState<Models.Document | null>(null);

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

    const handleMetricDeleted = () => {
        metricsRefetch({ userId: user?.$id ?? "" });
    };

    const handleMetricSaved = () => {
        metricsRefetch({ userId: user?.$id ?? "" });
        setEditingMetric(null);
    };

    const handleEditMetric = (metric: Models.Document) => {
        setEditingMetric(metric);
        bottomSheetModalRef.current?.present();
    };

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
                    <MetricItem item={item} onDelete={handleMetricDeleted} onEdit={() => handleEditMetric(item)} />
                )}
            />

            {/* Create Metric */}
            <CreateMetricButton onPress={() => bottomSheetModalRef.current?.present()} />
            <MetricButtomSheetModal
                ref={bottomSheetModalRef}
                editMetric={editingMetric}
                onMetricCreated={handleMetricSaved}
            />
        </SafeAreaView>
    );
};

export default Metrics;
