import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";

import { InputFieldProps } from "@/types/type";

const FormInputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={`w-full my-3 ${className}`}>
          {/* Input Label */}
          <Text className={`text-base font-JakartaSemiBold mb-2 ${labelStyle}`}>
            {label}
          </Text>

          {/* Input Field Container */}
          <View
            className={`flex-row items-center bg-neutral-100 rounded-full border border-neutral-200 px-4 ${containerStyle}`}
          >
            {/* Icon (optional) */}
            {icon && (
              <Image source={icon} className={`w-5 h-5 mr-3 ${iconStyle}`} />
            )}

            {/* Text Input */}
            <TextInput
              secureTextEntry={secureTextEntry}
              className={`flex-1 py-3 text-[15px] font-JakartaRegular ${inputStyle}`}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default FormInputField;
