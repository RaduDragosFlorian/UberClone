import { router } from "expo-router";
import { Text, View } from "react-native";

import AccentButton from "@/components/AccentButton";
import PlacesSearchInput from "@/components/PlacesSearchInput";
import JourneyLayout from "@/components/JourneyLayout";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";

const FindRide = () => {
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  return (
    <JourneyLayout headerText="Ride" sheetHeights={[]}>
      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3">From</Text>

        <PlacesSearchInput
          icon={icons.target}
          initialLocation={userAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="#f5f5f5"
          handlePress={(location) => setUserLocation(location)}
        />
      </View>

      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3">To</Text>

        <PlacesSearchInput
          icon={icons.map}
          initialLocation={destinationAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="transparent"
          handlePress={(location) => setDestinationLocation(location)}
        />
      </View>

      <AccentButton
        title="Find Now"
        onPress={() => router.push(`/(root)/confirm-ride`)}
        className="mt-5 mb-10"
      />
    </JourneyLayout>
  );
};

export default FindRide;
