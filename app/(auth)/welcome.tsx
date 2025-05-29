import { router } from "expo-router";
import Swiper from "react-native-swiper";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useState } from "react";
import { onboarding } from "@/constants";
import AccentButton from "@/components/AccentButton";

const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <SafeAreaView className="flex-1 bg-emerald-50">
      <View className="flex justify-end items-end p-5">
        <TouchableOpacity onPress={() => router.replace("/(auth)/sign-up")}>
          <Text className="text-emerald-600 text-md font-JakartaBold">
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      <Swiper
        ref={swiperRef}
        loop={false}
        onIndexChanged={setActiveIndex}
        dot={<View className="w-2 h-2 rounded-full bg-emerald-200 mx-1" />}
        activeDot={
          <View className="w-4 h-2 rounded-full bg-emerald-600 mx-1" />
        }
        className="h-[60%]"
      >
        {onboarding.map((item) => (
          <View key={item.id} className="items-center justify-center px-6">
            <Image
              source={item.image}
              resizeMode="contain"
              className="w-[100%] h-[60%]"
            />
            <Text className="text-2xl font-JakartaBold text-center mt-6 text-emerald-600">
              {item.title}
            </Text>
            <Text className="text-base text-center mt-4 text-emerald-500">
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>

      <View className="px-6 pb-8">
        <AccentButton
          title={isLastSlide ? "Get Started" : "Next"}
          onPress={() => {
            if (isLastSlide) {
              router.replace("/(auth)/sign-up");
            } else {
              swiperRef.current?.scrollBy(1);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
