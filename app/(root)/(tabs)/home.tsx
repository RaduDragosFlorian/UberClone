import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";

import PlacesSearchInput from "@/components/PlacesSearchInput";
import RideMap from "@/components/RideMap";
import TripSummaryCard from "@/components/TripSummaryCard";
import { icons, images } from "@/constants";
import { useLocationStore } from "@/store";
import { useFetch } from "@/lib/fetch";

const HomeScreen = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const [locationGranted, setLocationGranted] = useState(false);
  const { data: recentTrips, loading } = useFetch(`/(api)/ride/${user?.id}`);

  useEffect(() => {
    const retrieveLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationGranted(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync();
      const address = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });

      setLocationGranted(true);
    };

    retrieveLocation();
  }, []);

  const onSearchLocationSelected = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    router.push("/(root)/ride-find");
  };

  const logOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  const renderWelcomeHeader = () => (
    <View className="flex flex-row justify-between items-center my-5">
      <Text className="text-2xl font-JakartaExtraBold text-emerald-600 capitalize">
        Welcome,{" "}
        {user?.firstName || user?.emailAddresses[0].emailAddress.split("@")[0]}{" "}
        👋
      </Text>
      <TouchableOpacity
        onPress={logOut}
        className="w-10 h-10 bg-emerald-100 items-center justify-center rounded-full"
      >
        <Image source={icons.out} className="w-4 h-4 tint-emerald-600" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex items-center justify-center">
      {!loading ? (
        <>
          <Image
            source={images.noResult}
            className="w-40 h-40"
            resizeMode="contain"
          />
          <Text className="text-emerald-600 mt-2">No recent rides</Text>
        </>
      ) : (
        <ActivityIndicator size="small" color="#10B981" />
      )}
    </View>
  );

  return (
    <SafeAreaView className="bg-emerald-50">
      <FlatList
        data={recentTrips?.slice(0, 5)}
        renderItem={({ item }) => <TripSummaryCard ride={item} />}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={() => (
          <>
            {renderWelcomeHeader()}
            <PlacesSearchInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-emerald-200"
              handlePress={onSearchLocationSelected}
            />
            <Text className="text-xl font-JakartaBold text-emerald-600 mt-5 mb-3">
              Your current location
            </Text>
            <View className="h-[300px] rounded-xl overflow-hidden border border-emerald-100">
              <RideMap />
            </View>
            <Text className="text-xl font-JakartaBold text-emerald-600 mt-5 mb-3">
              Recent Rides
            </Text>
          </>
        )}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
