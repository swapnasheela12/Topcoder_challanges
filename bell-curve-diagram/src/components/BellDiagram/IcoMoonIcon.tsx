import IcoMoon from "icomoon-react";
import React from "react";
import iconSet from "../../../public/fonts/icomoon/selection.json";

interface IconProps {
  icon: string;
  size?: number;
  color?: string;
}

const IcoMoonIcon: React.FC<IconProps> = ({ icon, size = 24, color = "#ffffff" }) => {
  return <IcoMoon iconSet={iconSet} icon={icon} size={size} color={color} />;
};

export default IcoMoonIcon;
