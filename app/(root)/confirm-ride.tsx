import { router } from "expo-router";
import { FlatList, View } from "react-native";

import AccentButton from "@/components/AccentButton";
import ChauffeurCard from "@/components/ChauffeurCard";
import JourneyLayout from "@/components/JourneyLayout";
import { useDriverStore } from "@/store";

const ConfirmRide = () => {
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();

  return (
    <JourneyLayout headerText={"Choose a Rider"} sheetHeights={["65%", "85%"]}>
      <FlatList
        data={drivers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <ChauffeurCard
            item={item}
            selected={selectedDriver!}
            setSelected={() => setSelectedDriver(item.id!)}
          />
        )}
        ListFooterComponent={() => (
          <View className="mx-5 mt-10">
            <AccentButton
              title="Select Ride"
              onPress={() => router.push("/(root)/book-ride")}
            />
          </View>
        )}
      />
    </JourneyLayout>
  );
};

export default ConfirmRide;
