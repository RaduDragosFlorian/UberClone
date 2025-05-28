import { router } from "expo-router";
import { FlatList, View } from "react-native";

import AccentButton from "@/components/AccentButton";
import ChauffeurCard from "@/components/ChauffeurCard";
import JourneyLayout from "@/components/JourneyLayout";
import { useDriverStore } from "@/store";

const RideConfirmationScreen = () => {
  const {
    drivers: availableDrivers,
    selectedDriver: activeDriverId,
    setSelectedDriver,
  } = useDriverStore();

  const handleDriverSelect = (driverId: number) => {
    setSelectedDriver(driverId);
  };

  const renderDriverCard = ({ item }: { item: any }) => (
    <ChauffeurCard
      item={item}
      selected={activeDriverId!}
      setSelected={() => handleDriverSelect(item.id!)}
    />
  );

  const renderContinueButton = () => (
    <View className="mx-5 mt-10">
      <AccentButton
        title="Continue"
        onPress={() => router.push("/(root)/ride-booking")}
        disabled={!activeDriverId}
        className={`${!activeDriverId ? "opacity-50" : ""}`}
      />
    </View>
  );

  return (
    <JourneyLayout
      headerText="Choose Your Driver"
      sheetHeights={["25%", "75%"]}
    >
      <FlatList
        data={availableDrivers}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderDriverCard}
        ListFooterComponent={renderContinueButton}
      />
    </JourneyLayout>
  );
};

export default RideConfirmationScreen;
