import { router } from "expo-router";
import { Text, View } from "react-native";

import AccentButton from "@/components/AccentButton";
import PlacesSearchInput from "@/components/PlacesSearchInput";
import JourneyLayout from "@/components/JourneyLayout";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";

const RidePlaningScreen = () => {
  const {
    userAddress,
    destinationAddress,
    setUserLocation,
    setDestinationLocation,
  } = useLocationStore();

  const handlePickupSelect = (location: any) => {
    setUserLocation(location);
  };

  const handleDropoffSelect = (location: any) => {
    setDestinationLocation(location);
  };

  const navigateToConfirmation = () => {
    router.push("/(root)/ride-confirmation");
  };

  return (
    <JourneyLayout headerText="Plan Your Journey" sheetHeights={[]}>
      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3">
          Pickup Location
        </Text>
        <PlacesSearchInput
          icon={icons.target}
          initialLocation={userAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="#f5f5f5"
          handlePress={handlePickupSelect}
        />
      </View>

      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3">
          Dropoff Location
        </Text>
        <PlacesSearchInput
          icon={icons.map}
          initialLocation={destinationAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="transparent"
          handlePress={handleDropoffSelect}
        />
      </View>

      <AccentButton
        title="Search Rides"
        onPress={navigateToConfirmation}
        className="mt-5 mb-10"
      />
    </JourneyLayout>
  );
};

export default RidePlaningScreen;
