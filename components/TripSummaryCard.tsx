import { Image, Text, View } from "react-native";

import { icons } from "@/constants";
import { formatDate, formatTime } from "@/lib/utils";
import { Ride } from "@/types/type";

const TripSummaryCard = ({ ride: trip }: { ride: Ride }) => {
  return (
    <View className="flex-row items-center justify-center bg-white rounded-xl shadow shadow-neutral-300 mb-4">
      <View className="flex-col justify-start items-start p-3 w-full">
        {/* This image shows a map snapshot of where I was headed */}
        <View className="flex-row items-center justify-between w-full">
          <Image
            source={{
              uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${trip.destination_longitude},${trip.destination_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
            }}
            className="w-[80px] h-[90px] rounded-lg"
          />

          {/* Starting and ending points of my trip */}
          <View className="flex-1 mx-5 gap-y-4">
            <View className="flex-row items-center gap-x-2">
              <Image source={icons.to} className="w-5 h-5" />
              <Text
                className="text-[15px] font-JakartaMedium"
                numberOfLines={1}
              >
                {trip.origin_address}
              </Text>
            </View>

            <View className="flex-row items-center gap-x-2">
              <Image source={icons.point} className="w-5 h-5" />
              <Text
                className="text-[15px] font-JakartaMedium"
                numberOfLines={1}
              >
                {trip.destination_address}
              </Text>
            </View>
          </View>
        </View>

        {/* Everything I need to know about the trip in one box */}
        <View className="mt-5 w-full bg-general-500 p-4 rounded-xl">
          <View className="flex-row justify-between mb-4">
            <Text className="text-sm text-gray-500 font-JakartaMedium">
              Date & Time
            </Text>
            <Text className="text-sm font-JakartaBold">
              {formatDate(trip.created_at)}, {formatTime(trip.ride_time)}
            </Text>
          </View>

          <View className="flex-row justify-between mb-4">
            <Text className="text-sm text-gray-500 font-JakartaMedium">
              Driver
            </Text>
            <Text className="text-sm font-JakartaBold">
              {trip.driver.first_name} {trip.driver.last_name}
            </Text>
          </View>

          <View className="flex-row justify-between mb-4">
            <Text className="text-sm text-gray-500 font-JakartaMedium">
              Car Seats
            </Text>
            <Text className="text-sm font-JakartaBold">
              {trip.driver.car_seats}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-500 font-JakartaMedium">
              Payment
            </Text>
            <Text
              className={`text-sm font-JakartaBold capitalize ${
                trip.payment_status === "paid"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {trip.payment_status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TripSummaryCard;
