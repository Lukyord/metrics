import { Text, TouchableOpacity, View } from "react-native";
import React, {
    Dispatch,
    forwardRef,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
    BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { metricsService } from "@/services/metrics";
import { useGlobalContext } from "@/context/global-provider";
import { MetricAppwrite } from "@/types/metrics-type";
import { Models } from "react-native-appwrite";
type MetricButtomSheetModalProps = {
    onMetricCreated: () => void;
    editMetric?: Models.Document | null;
    setEditingMetric: Dispatch<SetStateAction<Models.Document | null>>;
};

const MetricButtomSheetModal = forwardRef<
    BottomSheetModalMethods,
    MetricButtomSheetModalProps
>(({ onMetricCreated, editMetric, setEditingMetric }, ref) => {
    const { user } = useGlobalContext();
    const [metricName, setMetricName] = useState("");
    const snapPoints = useMemo(() => ["50%", "75%"], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    );

    const handleSaveMetric = async () => {
        let response;

        if (editMetric) {
            response = await metricsService.update({
                documentId: editMetric.$id,
                data: { name: metricName },
            });
        } else {
            const metric: MetricAppwrite = {
                name: metricName,
                user_id: user?.$id ?? "",
            };
            response = await metricsService.create({ data: metric });
        }

        if ("error" in response) {
            console.log("Error saving metric: ", response.error);
            return { error: response.error };
        }

        if (ref && "current" in ref && ref.current) {
            ref.current.dismiss();
        }

        onMetricCreated();
        setMetricName("");

        return { data: response };
    };

    useEffect(() => {
        if (editMetric) {
            setMetricName(editMetric.name);
        } else {
            setMetricName("");
        }
    }, [editMetric]);

    return (
        <BottomSheetModal
            ref={ref}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{ backgroundColor: "#595959" }}
            onDismiss={() => setEditingMetric(null)}
        >
            <BottomSheetView className="flex-col flex-1 gap-4 items-center p-6 h-[25vh]">
                <Text className="text-2xl font-dms-bold">
                    {editMetric ? "Edit Metric" : "Create Metric"}
                </Text>
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
                <TouchableOpacity
                    className="bg-black rounded-md px-6 py-2"
                    onPress={handleSaveMetric}
                >
                    <Text className="text-white font-dms-bold text-xl">
                        {editMetric ? "Update" : "Save"}
                    </Text>
                </TouchableOpacity>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

MetricButtomSheetModal.displayName = "MetricButtomSheetModal";

export default MetricButtomSheetModal;
