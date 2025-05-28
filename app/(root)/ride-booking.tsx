import { useUser } from "@clerk/clerk-expo";
import { StripeProvider } from "@stripe/stripe-react-native";
import { Image, Text, View } from "react-native";

import RidePayment from "@/components/RidePayment";
import JourneyLayout from "@/components/JourneyLayout";
import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { useDriverStore, useLocationStore } from "@/store";

const RideSummaryScreen = () => {
  const { user } = useUser();
  const { userAddress: pickupLocation, destinationAddress: dropoffLocation } =
    useLocationStore();
  const { drivers, selectedDriver } = useDriverStore();

  const selectedDriverInfo = drivers?.find(
    (driver) => Number(driver.id) === selectedDriver,
  );

  if (!user || !selectedDriverInfo) return null;

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier="merchant.com.uber"
      urlScheme="myapp"
    >
      <JourneyLayout headerText="Review Your Trip">
        <>
          {/* Summary Title */}
          <Text className="text-xl font-JakartaSemiBold mb-3">
            Trip Overview
          </Text>

          {/* Driver Card */}
          <View className="flex flex-col w-full items-center justify-center mt-8">
            <Image
              source={{ uri: selectedDriverInfo.profile_image_url }}
              className="w-28 h-28 rounded-full"
            />
            <View className="flex flex-row items-center justify-center mt-5 space-x-2">
              <Text className="text-lg font-JakartaSemiBold">
                {selectedDriverInfo.title}
              </Text>
              <View className="flex flex-row items-center space-x-1">
                <Image
                  source={icons.star}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="text-lg font-JakartaRegular">
                  {selectedDriverInfo.rating}
                </Text>
              </View>
            </View>
          </View>

          {/* Trip Details */}
          <View className="bg-general-600 px-5 py-3 rounded-3xl mt-6 w-full">
            <View className="flex flex-row justify-between items-center border-b border-white py-3">
              <Text className="text-lg font-JakartaRegular">Fare</Text>
              <Text className="text-lg font-JakartaRegular text-[#0CC25F]">
                ${selectedDriverInfo.price}
              </Text>
            </View>
            <View className="flex flex-row justify-between items-center border-b border-white py-3">
              <Text className="text-lg font-JakartaRegular">
                Estimated Departure
              </Text>
              <Text className="text-lg font-JakartaRegular">
                {formatTime(selectedDriverInfo.time!)}
              </Text>
            </View>
            <View className="flex flex-row justify-between items-center py-3">
              <Text className="text-lg font-JakartaRegular">
                Available Seats
              </Text>
              <Text className="text-lg font-JakartaRegular">
                {selectedDriverInfo.car_seats}
              </Text>
            </View>
          </View>

          {/* Payment First */}
          <RidePayment
            fullName={user.fullName!}
            email={user.emailAddresses[0].emailAddress!}
            amount={selectedDriverInfo.price!}
            driverId={selectedDriverInfo.id}
            rideTime={selectedDriverInfo.time!}
          />

          {/* Location Info */}
          <View className="flex flex-col w-full items-start justify-center mt-5">
            <View className="flex flex-row items-center justify-start mt-3 border-t border-b border-general-700 w-full py-3">
              <Image source={icons.to} className="w-6 h-6" />
              <Text className="text-lg font-JakartaRegular ml-2">
                {pickupLocation}
              </Text>
            </View>
            <View className="flex flex-row items-center justify-start border-b border-general-700 w-full py-3">
              <Image source={icons.point} className="w-6 h-6" />
              <Text className="text-lg font-JakartaRegular ml-2">
                {dropoffLocation}
              </Text>
            </View>
          </View>
        </>
      </JourneyLayout>
    </StripeProvider>
  );
};

export default RideSummaryScreen;
