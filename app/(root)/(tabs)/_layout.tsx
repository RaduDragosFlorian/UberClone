import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View } from "react-native";
import { icons } from "@/constants";

// Reusable tab icon component
const BottomTabIcon = ({
  source,
  isActive,
}: {
  source: ImageSourcePropType;
  isActive: boolean;
}) => {
  return (
    <View
      className={`flex flex-row justify-center items-center rounded-full ${
        isActive ? "bg-general-300" : ""
      }`}
    >
      <View
        className={`w-12 h-12 items-center justify-center rounded-full ${
          isActive ? "bg-general-400" : ""
        }`}
      >
        <Image
          source={source}
          tintColor="white"
          resizeMode="contain"
          className="w-7 h-7"
        />
      </View>
    </View>
  );
};

export default function TabNavigationLayout() {
  const customTabStyle = {
    backgroundColor: "#333333",
    borderRadius: 50,
    paddingBottom: 30,
    overflow: "hidden",
    marginHorizontal: 20,
    marginBottom: 20,
    height: 60,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
  };

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: customTabStyle,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <BottomTabIcon source={icons.home} isActive={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: "Trips",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <BottomTabIcon source={icons.list} isActive={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Messages",
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused }) => (
            <BottomTabIcon source={icons.chat} isActive={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Account",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <BottomTabIcon source={icons.profile} isActive={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
