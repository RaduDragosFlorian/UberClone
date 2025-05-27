import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { DriverCardProps } from "@/types/type";

const ChauffeurCard = ({
  item: driver,
  selected,
  setSelected,
}: DriverCardProps) => {
  const isSelected = selected === driver.id;

  return (
    <TouchableOpacity
      onPress={setSelected}
      className={`${
        isSelected ? "bg-general-600" : "bg-white"
      } flex flex-row items-center justify-between px-4 py-5 rounded-2xl border border-general-300`}
    >
      {/* Driver Avatar */}
      <Image
        source={{ uri: driver.profile_image_url }}
        className="w-14 h-14 rounded-full"
      />

      {/* Info Section */}
      <View className="flex-1 mx-4 flex flex-col items-start justify-center">
        {/* Name + Rating */}
        <View className="flex-row items-center mb-1">
          <Text className="text-lg font-JakartaSemiBold">{driver.title}</Text>
          <View className="flex-row items-center ml-2 space-x-1">
            <Image source={icons.star} className="w-3.5 h-3.5" />
            <Text className="text-sm font-JakartaRegular">4</Text>
          </View>
        </View>

        {/* Price + Time + Seats */}
        <View className="flex-row items-center text-sm text-general-800">
          <View className="flex-row items-center mr-2">
            <Image source={icons.dollar} className="w-4 h-4" />
            <Text className="ml-1">${driver.price}</Text>
          </View>

          <Text className="mx-1 text-general-800">|</Text>

          <Text className="text-general-800">
            {formatTime(parseInt(`${driver.time}`) || 5)}
          </Text>

          <Text className="mx-1 text-general-800">|</Text>

          <Text className="text-general-800">{driver.car_seats} seats</Text>
        </View>
      </View>

      {/* Car image */}
      <Image
        source={{ uri: driver.car_image_url }}
        className="h-14 w-14"
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default ChauffeurCard;
