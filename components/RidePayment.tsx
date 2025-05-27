import { useAuth } from "@clerk/clerk-expo";
import { useStripe } from "@stripe/stripe-react-native";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";

import CustomButton from "@/components/AccentButton";
import { images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useLocationStore } from "@/store";
import { PaymentProps } from "@/types/type";

const RidePayment = ({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const {
    userAddress,
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationAddress,
    destinationLongitude,
  } = useLocationStore();

  const { userId } = useAuth();
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const prepareStripeSheet = async () => {
    try {
      const response = await fetchAPI("/(api)/(stripe)/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName || email.split("@")[0],
          email,
          amount,
        }),
      });

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Ryde Inc.",
        paymentIntentClientSecret: response.paymentIntent.client_secret,
        customerEphemeralKeySecret: response.ephemeralKey.secret,
        customerId: response.customer,
      });

      if (error) {
        Alert.alert("Setup Error", error.message);
        return false;
      }

      return true;
    } catch (err) {
      Alert.alert("Stripe Error", "Something went wrong initializing payment.");
      return false;
    }
  };

  const startCheckoutFlow = async () => {
    const ready = await prepareStripeSheet();
    if (!ready) return;

    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Payment Failed: ${error.code}`, error.message);
    } else {
      setSuccessModalVisible(true);

      // Ride is created after a successful transaction
      await fetchAPI("/(api)/ride/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin_address: userAddress,
          destination_address: destinationAddress,
          origin_latitude: userLatitude,
          origin_longitude: userLongitude,
          destination_latitude: destinationLatitude,
          destination_longitude: destinationLongitude,
          ride_time: rideTime.toFixed(0),
          fare_price: parseInt(amount) * 100,
          payment_status: "paid",
          driver_id: driverId,
          user_id: userId,
        }),
      });
    }
  };

  return (
    <>
      <CustomButton
        title="Confirm Ride"
        className="my-10"
        onPress={startCheckoutFlow}
      />

      <ReactNativeModal
        isVisible={successModalVisible}
        onBackdropPress={() => setSuccessModalVisible(false)}
      >
        <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
          <Image source={images.check} className="w-28 h-28 mt-5" />

          <Text className="text-2xl text-center font-JakartaBold mt-5">
            Booking placed successfully
          </Text>

          <Text className="text-md text-general-200 font-JakartaRegular text-center mt-3">
            Thank you for choosing Ryde. Your trip has been confirmed — safe
            travels!
          </Text>

          <CustomButton
            title="Back Home"
            onPress={() => {
              setSuccessModalVisible(false);
              router.push("/(root)/(tabs)/home");
            }}
            className="mt-5"
          />
        </View>
      </ReactNativeModal>
    </>
  );
};

export default RidePayment;
