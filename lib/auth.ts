import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { TokenCache } from "@clerk/clerk-expo/dist/cache";

const createTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`${key} was used 🔐 \n`);
        } else {
          console.log("No values stored under key: " + key);
        }
        return item;
      } catch (error) {
        console.error("secure store get item error: ", error);
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    saveToken: (key: string, token: string) => {
      return SecureStore.setItemAsync(key, token);
    },
  };
};

import * as Linking from "expo-linking";
import { fetchAPI } from "./fetch"; // Adjust the path if necessary

export const googleOAuth = async (startOAuthFlow: any) => {
  try {
    const response = await startOAuthFlow({
      redirectUrl: Linking.createURL("/(root)/(tabs)/home"),
    });

    const { createdSessionId, setActive, signUp } = response;

    // If session is created, activate it
    if (createdSessionId && setActive) {
      await setActive({ session: createdSessionId });

      // If it's a new user, register them in your backend
      if (signUp?.createdUserId) {
        const userPayload = {
          name: `${signUp.firstName} ${signUp.lastName}`,
          email: signUp.emailAddress,
          clerkId: signUp.createdUserId,
        };

        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify(userPayload),
        });
      }

      return {
        success: true,
        code: "success",
        message: "You have successfully signed in with Google",
      };
    }

    // Fallback if no session is created
    return {
      success: false,
      message: "An error occurred while signing in with Google",
    };
  } catch (err: any) {
    console.error("Google OAuth Error:", err);

    return {
      success: false,
      code: err.code || "unknown_error",
      message: err?.errors?.[0]?.longMessage || "An unexpected error occurred",
    };
  }
};

// SecureStore is not supported on the web
export const tokenCache =
  Platform.OS !== "web" ? createTokenCache() : undefined;
