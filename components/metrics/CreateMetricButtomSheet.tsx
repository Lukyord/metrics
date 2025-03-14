import { Text, TouchableOpacity, View } from "react-native";
import React, { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { metricsService } from "@/services/metrics";
import { useGlobalContext } from "@/context/global-provider";
import { MetricAppwrite } from "@/types/metrics";

type CreateMetricButtomSheetModalProps = {
    onMetricCreated: () => void;
};

const CreateMetricButtomSheetModal = forwardRef<BottomSheetModalMethods, CreateMetricButtomSheetModalProps>(
    ({ onMetricCreated }, ref) => {
        const { user } = useGlobalContext();
        const [metricName, setMetricName] = useState("");
        const renderBackdrop = useCallback(
            (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
            []
        );
        const handleSheetChanges = useCallback((index: number) => {}, []);

        const handleCreateMetric = async () => {
            const metric: MetricAppwrite = {
                name: metricName,
                user_id: user?.$id ?? "",
            };

            const response = await metricsService.create({ data: metric });

            if ("error" in response) {
                console.log("Error creating metric at CreateMetricButtomSheetModal: ", response.error);
                return { error: response.error };
            }

            if (ref && "current" in ref && ref.current) {
                ref.current.dismiss();
            }

            onMetricCreated();

            return { data: response };
        };

        const snapPoints = useMemo(() => ["50%", "75%"], []);

        return (
            <BottomSheetModal
                ref={ref}
                onChange={handleSheetChanges}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                backdropComponent={renderBackdrop}
                handleIndicatorStyle={{ backgroundColor: "#595959" }}
            >
                <BottomSheetView className="flex-col flex-1 gap-4 items-center p-6 h-[25vh]">
                    <Text className="text-2xl font-dms-bold">Create Metric</Text>
                    <View className="w-full">
                        <Text className="font-dms-medium">Metric Name</Text>
                        <BottomSheetTextInput
                            value={metricName}
                            placeholder="Saxophone Practice..."
                            placeholderTextColor="#aaa"
                            onChangeText={(text) => setMetricName(text)}
                            className="border border-gray-300 rounded-md p-2 mt-2"
                        />
                    </View>
                    <TouchableOpacity className="bg-black rounded-md px-6 py-2" onPress={handleCreateMetric}>
                        <Text className="text-white font-dms-bold text-xl">Save</Text>
                    </TouchableOpacity>
                </BottomSheetView>
            </BottomSheetModal>
        );
    }
);

CreateMetricButtomSheetModal.displayName = "CreateMetricButtomSheetModal";

export default CreateMetricButtomSheetModal;
