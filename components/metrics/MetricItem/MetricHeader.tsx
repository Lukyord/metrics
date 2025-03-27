import { View, Text, TouchableOpacity, Animated, Image } from "react-native";
import React from "react";
import { icons } from "@/constant/icons";
import {
    SharedValue,
    runOnUI,
    withTiming,
    measure,
    AnimatedRef,
} from "react-native-reanimated";
import { Models } from "react-native-appwrite";

type MetricHeaderProps = {
    heightValue: SharedValue<number>;
    open: SharedValue<boolean>;
    metricItemRef: AnimatedRef<React.Component<{}, {}, any>>;
    iconStyle: {
        transform: {
            rotate: string;
        }[];
    };
    onPress: () => void;
    item: Models.Document;
};

const MetricHeader = ({
    heightValue,
    open,
    metricItemRef,
    iconStyle,
    onPress,
    item,
}: MetricHeaderProps) => {
    return (
        <TouchableOpacity
            onPress={() => {
                if (heightValue.value === 0) {
                    runOnUI(() => {
                        "worklet";
                        heightValue.value = withTiming(
                            measure(metricItemRef)!.height
                        );
                    })();
                } else {
                    heightValue.value = withTiming(0);
                }

                open.value = !open.value;
            }}
        >
            <View className="flex flex-row items-center justify-between gap-4 p-3 h-[50px]">
                <View className="flex flex-row gap-4 items-center">
                    <Text className="text-xl font-dm-sans-bold text-white">
                        {item.name}
                    </Text>
                </View>
                <Animated.View style={iconStyle}>
                    <Image
                        source={icons.TriangleDown}
                        className="w-4 h-4"
                        tintColor="#fff"
                    />
                </Animated.View>
            </View>
        </TouchableOpacity>
    );
};

export default MetricHeader;
