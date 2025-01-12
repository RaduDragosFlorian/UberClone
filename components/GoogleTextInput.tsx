import { GoogleInputProps } from "@/types/type";
import { View, Text } from "react-native";
import GooglePlacesAutocomplete from "react-native-google-places-autocomplete";

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => (
  <View
    className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}
  >
    <GooglePlacesAutocomplete
      fetchDetails={true}
      placeholder="Where you want to go?"
      debounce={200}
    />
  </View>
);
export default GoogleTextInput;
