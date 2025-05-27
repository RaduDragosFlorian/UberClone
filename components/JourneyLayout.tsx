import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef, useCallback } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import RideMap from "@/components/RideMap";
import { icons } from "@/constants";

interface JourneyLayoutProps {
  headerText: string;
  sheetHeights?: (string | number)[];
  children: React.ReactNode;
}

const JourneyLayout = ({
  headerText,
  sheetHeights,
  children,
}: JourneyLayoutProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <GestureHandlerRootView className="flex-1 bg-emerald-50">
      <View className="flex-1">
        {/* Header & Map Area */}
        <View className="h-screen bg-emerald-600 relative">
          <View className="absolute z-10 top-14 left-4 right-4 flex-row items-center">
            <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
              <View className="w-11 h-11 bg-white rounded-full items-center justify-center shadow-md">
                <Image
                  source={icons.backArrow}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </View>
            </TouchableOpacity>
            <Text className="ml-4 text-lg text-white font-semibold tracking-wide">
              {headerText || "Back"}
            </Text>
          </View>

          <RideMap />
        </View>

        {/* Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={sheetHeights || ["35%", "80%"]}
          index={0}
          backgroundStyle={{ backgroundColor: "#f0fdf4" }}
        >
          <BottomSheetView
            style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 20 }}
          >
            {children}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default JourneyLayout;
