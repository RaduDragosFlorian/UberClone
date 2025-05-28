import { useUser } from "@clerk/clerk-expo";
import { Image, Text, View, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import InputField from "@/components/FormInputField";
import AccentButton from "@/components/AccentButton";

const Profile = () => {
  const { user } = useUser();
  const profileImage = user?.externalAccounts?.[0]?.imageUrl ?? user?.imageUrl;

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phone, setPhone] = useState(
    user?.primaryPhoneNumber?.phoneNumber || "",
  );

  const handleSavePhone = () => {
    Alert.alert("Saved", `Phone number updated to ${phone}`);
    setIsEditingPhone(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-emerald-50 px-5">
      <Text className="text-2xl font-JakartaBold text-emerald-600 my-5">
        My Profile
      </Text>

      <View className="flex items-center justify-center my-5">
        <Image
          source={{ uri: profileImage }}
          style={{ width: 110, height: 110, borderRadius: 55 }}
          className="rounded-full border-[3px] border-white shadow-sm shadow-emerald-200"
        />
      </View>

      <View className="flex flex-col items-start justify-center bg-white rounded-xl shadow-sm shadow-emerald-200 px-5 py-3">
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
          <Text className="text-base font-semibold text-emerald-600 mb-1">
            Phone
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            editable={isEditingPhone}
            keyboardType="phone-pad"
            className="border border-emerald-200 rounded-lg p-3.5 text-base bg-emerald-100"
          />
          <View className="flex-row justify-end mt-2">
            {isEditingPhone ? (
              <AccentButton title="Save" onPress={handleSavePhone} />
            ) : (
              <AccentButton
                title="Edit"
                onPress={() => setIsEditingPhone(true)}
              />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
