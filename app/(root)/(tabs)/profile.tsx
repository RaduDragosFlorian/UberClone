import { useUser } from "@clerk/clerk-expo";
import { Image, ScrollView, Text, View, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";

const Profile = () => {
  const { user } = useUser();

  const profileImage = user?.externalAccounts?.[0]?.imageUrl ?? user?.imageUrl;

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phone, setPhone] = useState(
    user?.primaryPhoneNumber?.phoneNumber || "",
  );

  const handleSavePhone = () => {
    // Simulate saving logic or integrate with Clerk API
    Alert.alert("Saved", `Phone number updated to ${phone}`);
    setIsEditingPhone(false);
  };

  const renderProfileImage = () => (
    <View className="flex items-center justify-center my-5">
      <Image
        source={{ uri: profileImage }}
        style={{ width: 110, height: 110, borderRadius: 55 }}
        className="rounded-full border-[3px] border-white shadow-sm shadow-neutral-300"
      />
    </View>
  );

  const renderProfileFields = () => (
    <View className="flex flex-col items-start justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3">
      <InputField
        label="First name"
        placeholder={user?.firstName || "Not Found"}
        containerStyle="w-full"
        inputStyle="p-3.5"
        editable={false}
      />

      <InputField
        label="Last name"
        placeholder={user?.lastName || "Not Found"}
        containerStyle="w-full"
        inputStyle="p-3.5"
        editable={false}
      />

      <InputField
        label="Email"
        placeholder={user?.primaryEmailAddress?.emailAddress || "Not Found"}
        containerStyle="w-full"
        inputStyle="p-3.5"
        editable={false}
      />

      <View className="w-full my-2">
        <Text className="text-base font-semibold mb-1">Phone</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          editable={isEditingPhone}
          keyboardType="phone-pad"
          className="border border-neutral-300 rounded-lg p-3.5 text-base bg-neutral-100"
        />
        <View className="flex-row justify-end mt-2">
          {isEditingPhone ? (
            <CustomButton title="Save" onPress={handleSavePhone} />
          ) : (
            <CustomButton
              title="Edit"
              onPress={() => setIsEditingPhone(true)}
            />
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-2xl font-JakartaBold my-5">My profile</Text>
        {renderProfileImage()}
        {renderProfileFields()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
