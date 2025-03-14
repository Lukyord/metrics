import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StyleSheet, Button } from "react-native";

import { icons } from "@/constant/icons";
import { metricsService } from "@/services/metrics";
import CreateMetricButton from "@/components/metrics/CreateMetricButton";
import CreateMetricButtomSheetModal from "@/components/metrics/CreateMetricButtomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const Metrics = () => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const handleClosePress = () => bottomSheetModalRef.current?.dismiss();

    return (
        <SafeAreaView className="flex-1 bg-primary-100 relative">
            <ScrollView>
                <View className="h-[200vh]  w-full flex-col justify-center items-center">
                    <Text className="text-2xl font-bold">Metrics</Text>
                </View>
            </ScrollView>

            {/* Create Metric */}
            <CreateMetricButton onPress={() => bottomSheetModalRef.current?.present()} />
            <CreateMetricButtomSheetModal ref={bottomSheetModalRef} />
        </SafeAreaView>
    );
};

export default Metrics;
