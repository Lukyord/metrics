import { Text } from "react-native";
import React, { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

type CreateMetricButtomSheetModalProps = {};

const CreateMetricButtomSheetModal = forwardRef<BottomSheetModalMethods, CreateMetricButtomSheetModalProps>(
    (props, ref) => {
        const renderBackdrop = useCallback(
            (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
            []
        );
        const handleSheetChanges = useCallback((index: number) => {
            console.log("handleSheetChanges", index);
        }, []);

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
                <BottomSheetView className="flex-1 p-6 h-[50vh]">
                    <Text className="text-2xl font-dms-bold">Create Metric</Text>
                </BottomSheetView>
            </BottomSheetModal>
        );
    }
);

CreateMetricButtomSheetModal.displayName = "CreateMetricButtomSheetModal";

export default CreateMetricButtomSheetModal;
