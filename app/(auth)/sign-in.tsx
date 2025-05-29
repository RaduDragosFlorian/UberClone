import { Image, Text, ScrollView, View } from "react-native";
import { icons, images } from "@/constants";
import { useCallback, useState } from "react";
import { Link, useRouter } from "expo-router";
import AccentButton from "@/components/AccentButton";
import OAuth from "@/components/OAuth";
import InputField from "@/components/FormInputField";
import { useSignIn } from "@clerk/clerk-expo";

function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      const firstError =
        err.errors?.[0]?.message || "An unexpected error occurred";
      setError(firstError);
    }
  }, [isLoaded, form.email, form.password]);

  return (
    <ScrollView className="flex-1 bg-emerald-50">
      <View className="flex-1 bg-emerald-50">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-emerald-600 font-JakartaSemiBold absolute bottom-5 left-5">
            Welcome 👋
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => {
              setForm({ ...form, email: value });
              if (error) setError("");
            }}
          />

          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => {
              setForm({ ...form, password: value });
              if (error) setError("");
            }}
          />

          {error !== "" && (
            <View className="bg-red-100 border border-red-300 rounded-lg p-3 mt-3">
              <Text className="text-red-700 text-sm">{error}</Text>
            </View>
          )}

          <AccentButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6"
          />

          <OAuth />

          <Link
            href="/sign-up"
            className="text-lg text-center text-neutral-500 mt-10"
          >
            <Text className="text-lg text-center text-emerald-600 mt-10">
              Don't have an account?{" "}
            </Text>
            <Text className="font-JakartaBold underline text-emerald-800">
              Sign Up
            </Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

export default SignIn;
