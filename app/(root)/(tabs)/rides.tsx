import { useUser } from "@clerk/clerk-expo";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RideCard from "@/components/TripSummaryCard";
import { images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { Ride } from "@/types/type";

const Rides = () => {
  const { user } = useUser();

  const { data: rides, loading } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);

  const renderEmptyComponent = () => (
    <View className="flex flex-col items-center justify-center">
      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <>
          <Image
            source={images.noResult}
            className="w-40 h-40"
            alt="No recent rides found"
            resizeMode="contain"
          />
          <Text className="text-sm">No recent rides found</Text>
        </>
      )}
    </View>
  );

  const renderHeader = () => (
    <Text className="text-2xl font-JakartaBold my-5">All Rides</Text>
  );

  const renderItem = ({ item }: { item: Ride }) => <RideCard ride={item} />;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={rides}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        className="px-5"
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={renderEmptyComponent}
        ListHeaderComponent={renderHeader}
      />
    </SafeAreaView>
  );
};

export default Rides;
