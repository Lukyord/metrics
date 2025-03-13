import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlus = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={24}
    height={24}
    viewBox="0 0 42 42"
    {...props}
  >
    <Path d="M42 20H22V0h-2v20H0v2h20v20h2V22h20z" />
  </Svg>
);
export default SvgPlus;
