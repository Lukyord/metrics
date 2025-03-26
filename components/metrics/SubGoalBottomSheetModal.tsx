import { Text, TouchableOpacity, View } from "react-native";
import React, {
    Dispatch,
    forwardRef,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
    BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { SubgoalAppwrite } from "@/types/metrics-type";
import { Models } from "react-native-appwrite";
import { subgoalsService } from "@/services/subgoals";

type SubGoalBottomSheetModalProps = {
    onSubgoalCreated: () => void;
    editSubgoal?: Models.Document | null;
    setEditingSubgoal: Dispatch<SetStateAction<Models.Document | null>>;
    metricId: string;
};

const SubGoalBottomSheetModal = forwardRef<
    BottomSheetModalMethods,
    SubGoalBottomSheetModalProps
>(({ onSubgoalCreated, editSubgoal, setEditingSubgoal, metricId }, ref) => {
    const [subgoalName, setSubgoalName] = useState("");
    const [progress, setProgress] = useState("");
    const [unit, setUnit] = useState("");
    const snapPoints = useMemo(() => ["50%"], []);

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

    const handleSaveSubgoal = async () => {
        let response;

        if (editSubgoal) {
            response = await subgoalsService.update({
                documentId: editSubgoal.$id,
                data: {
                    name: subgoalName,
                    progress: Number(progress),
                    unit,
                },
            });
        } else {
            const subgoal: SubgoalAppwrite = {
                name: subgoalName,
                metrics: metricId,
                progress: Number(progress),
                unit,
            };
            response = await subgoalsService.create({ data: subgoal });
        }

        if ("error" in response) {
            console.log("Error saving subgoal: ", response.error);
            return { error: response.error };
        }

        if (ref && "current" in ref && ref.current) {
            ref.current.dismiss();
        }

        onSubgoalCreated();
        setSubgoalName("");
        setProgress("");
        setUnit("");

        return { data: response };
    };

    useEffect(() => {
        if (editSubgoal) {
            setSubgoalName(editSubgoal.name);
            setProgress(editSubgoal.progress.toString());
            setUnit(editSubgoal.unit);
        } else {
            setSubgoalName("");
            setProgress("");
            setUnit("");
        }
    }, [editSubgoal]);

    return (
        <BottomSheetModal
            ref={ref}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{ backgroundColor: "#595959" }}
            onDismiss={() => setEditingSubgoal(null)}
        >
            <BottomSheetView className="flex-col flex-1 gap-4 items-center p-6 h-[25vh]">
                <Text className="text-2xl font-dms-bold">
                    {editSubgoal ? "Edit Subgoal" : "Create Subgoal"}
                </Text>
                <View className="w-full">
                    <Text className="font-dms-medium">Subgoal Name</Text>
                    <BottomSheetTextInput
                        value={subgoalName}
                        placeholder="Practice scales..."
                        placeholderTextColor="#aaa"
                        onChangeText={(text) => setSubgoalName(text)}
                        className="border border-gray-300 rounded-md p-2 mt-2"
                    />
                </View>
                <View className="w-full flex-row gap-4">
                    <View className="flex-1">
                        <Text className="font-dms-medium">Progress</Text>
                        <BottomSheetTextInput
                            value={progress}
                            placeholder="0"
                            placeholderTextColor="#aaa"
                            onChangeText={(text) => setProgress(text)}
                            keyboardType="numeric"
                            className="border border-gray-300 rounded-md p-2 mt-2"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="font-dms-medium">Unit</Text>
                        <BottomSheetTextInput
                            value={unit}
                            placeholder="minutes"
                            placeholderTextColor="#aaa"
                            onChangeText={(text) => setUnit(text)}
                            className="border border-gray-300 rounded-md p-2 mt-2"
                        />
                    </View>
                </View>
                <TouchableOpacity
                    className="bg-black rounded-md px-6 py-2"
                    onPress={handleSaveSubgoal}
                >
                    <Text className="text-white font-dms-bold text-xl">
                        {editSubgoal ? "Update" : "Save"}
                    </Text>
                </TouchableOpacity>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

SubGoalBottomSheetModal.displayName = "SubGoalBottomSheetModal";

export default SubGoalBottomSheetModal;
