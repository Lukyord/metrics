import { View, Text, TouchableOpacity } from "react-native";

type MetricActionsProps = {
    onAddSubgoal: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

const MetricActionFooter = ({
    onAddSubgoal,
    onEdit,
    onDelete,
}: MetricActionsProps) => {
    return (
        <View className="w-full flex flex-row items-center justify-end mt-6 gap-2">
            <TouchableOpacity
                onPress={onAddSubgoal}
                className="bg-gray-300 p-3 rounded-full"
            >
                <Text className="text-black font-dms-medium text-xl">
                    🚩 Add Subgoal
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onEdit}
                className="bg-gray-300 p-3 rounded-full"
            >
                <Text className="text-xl">✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onDelete}
                className="bg-gray-300 p-3 rounded-full"
            >
                <Text className="text-xl">🗑️</Text>
            </TouchableOpacity>
        </View>
    );
};

export default MetricActionFooter;
