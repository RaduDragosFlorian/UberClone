import React from "react";
import { View, Text, FlatList, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";

import TripSummaryCard from "@/components/TripSummaryCard";
import { images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { Ride } from "@/types/type";

const RidesScreen = () => {
  const { user } = useUser();
  const { data: rides, loading } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);

  const renderEmptyComponent = () => (
    <View className="flex flex-col items-center justify-center">
      {loading ? (
        <ActivityIndicator size="small" color="#10B981" />
      ) : (
        <>
          <Image
            source={images.noResult}
            className="w-40 h-40"
            resizeMode="contain"
          />
          <Text className="text-emerald-600 mt-2">No rides found</Text>
        </>
      )}
    </View>
  );

  const renderHeader = () => (
    <Text className="text-2xl font-JakartaBold text-emerald-600 my-5">
      All Journeys
    </Text>
  );

  return (
    <SafeAreaView className="flex-1 bg-emerald-50">
      <FlatList
        data={rides}
        renderItem={({ item }) => <TripSummaryCard ride={item} />}
        keyExtractor={(_, index) => index.toString()}
        className="px-5"
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={renderEmptyComponent}
        ListHeaderComponent={renderHeader}
      />
    </SafeAreaView>
  );
};

export default RidesScreen;
