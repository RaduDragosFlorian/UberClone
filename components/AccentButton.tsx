import { TouchableOpacity, Text } from "react-native";
import { ButtonProps } from "@/types/type";

// Use Tailwind color classes from your theme config
const getAccentBgColor = (variant: ButtonProps["bgVariant"]) => {
  switch (variant) {
    case "secondary":
      return "bg-secondary-600";
    case "danger":
      return "bg-danger-600";
    case "success":
      return "bg-success-500";
    case "outline":
      return "bg-transparent border border-general-300";
    default:
      return "bg-success-500"; // default is emerald
  }
};

const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
  switch (variant) {
    case "primary":
      return "text-primary-900";
    case "secondary":
      return "text-secondary-100";
    case "danger":
      return "text-danger-100";
    case "success":
      return "text-white";
    default:
      return "text-white";
  }
};

const AccentButton = ({
  onPress,
  title,
  bgVariant = "success", // 🟢 default: emerald color
  textVariant = "default",
  IconLeft,
  IconRight,
  className,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-full rounded-full px-6 py-4 flex flex-row justify-center items-center gap-2 ${getAccentBgColor(bgVariant)} ${className}`}
      activeOpacity={0.85}
      {...props}
    >
      {IconLeft && <IconLeft />}
      <Text
        className={`text-base font-semibold ${getTextVariantStyle(textVariant)}`}
      >
        {title}
      </Text>
      {IconRight && <IconRight />}
    </TouchableOpacity>
  );
};

export default AccentButton;
