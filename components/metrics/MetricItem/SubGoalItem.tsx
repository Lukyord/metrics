import { Models } from "react-native-appwrite";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

type SubgoalItemProps = {
    subgoal: Models.Document;
    loading: boolean;
    onIncrement: (subgoal: Models.Document) => void;
    onDelete: (subgoal: Models.Document) => void;
    onEdit: (subgoal: Models.Document) => void;
};

const SubgoalItem = ({
    subgoal,
    loading,
    onIncrement,
    onDelete,
    onEdit,
}: SubgoalItemProps) => {
    return (
        <View className="bg-gray-100 p-2 rounded-md my-1">
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="font-dms-medium">{subgoal.name}</Text>
                    <Text className="text-gray-600">
                        Progress: {subgoal.progress} {subgoal.unit}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => onIncrement(subgoal)}
                    className="bg-primary-200 px-2 py-1 rounded-full"
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text className="text-white font-dms-medium">➕</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View className="flex-row gap-2 mt-2">
                <TouchableOpacity
                    onPress={() => onDelete(subgoal)}
                    className="bg-primary-200 px-2 py-1 rounded-full"
                >
                    <Text className="text-white font-dms-medium">🗑️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onEdit(subgoal)}
                    className="bg-primary-200 px-2 py-1 rounded-full"
                >
                    <Text className="text-white font-dms-medium">👨🏻‍💻 Edit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SubgoalItem;
