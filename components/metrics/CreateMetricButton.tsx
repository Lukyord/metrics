import { TouchableOpacity, Image } from "react-native";
import React from "react";
import { icons } from "@/constant/icons";

type CreateMetricButtonProps = {
    onPress: () => void;
};

const CreateMetricButton = ({ onPress }: CreateMetricButtonProps) => {
    return (
        <TouchableOpacity className="z-30 absolute bottom-[15%] right-10 bg-black p-4 rounded-full" onPress={onPress}>
            <Image source={icons.Plus} className="size-6" tintColor="white" />
        </TouchableOpacity>
    );
};

export default CreateMetricButton;
