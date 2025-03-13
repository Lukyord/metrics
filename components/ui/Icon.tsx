import { View } from "react-native";
import React from "react";
import { IconType } from "@/types/icon-type";
import * as Icons from "@/components/icons";

export type IconProps = {
    icon: IconType;
} & React.ComponentProps<typeof View>;

const Icon = ({ icon, ...props }: IconProps) => {
    const Component = Icons[icon as keyof typeof Icons];

    if (!Component) {
        console.error(`Icon "${icon}" not found.`);
        return null;
    }

    return (
        <View {...props}>
            <Component width={24} height={24} fill="black" />
        </View>
    );
};

export default Icon;
