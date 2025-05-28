import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { fetchAPI } from "@/lib/fetch";
import { Ionicons } from "@expo/vector-icons";
import { icons } from "@/constants";

type User = {
  name: string;
  email: string;
};

type Message = {
  id: string;
  sender_email: string;
  receiver_email: string;
  content: string;
  created_at: string;
};

const TAB_BAR_HEIGHT = 90;

const ChatScreen = () => {
  const { user } = useUser();
  const currentUserEmail = user?.primaryEmailAddress?.emailAddress;
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const [email, setEmail] = useState("");
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState(false);

  const searchUser = async () => {
    if (!email.trim()) return;
    setSearching(true);
    try {
      const result = await fetchAPI(`/(api)/chat/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (result.error) throw new Error(result.error);
      setFoundUser(result.data);
      setMessages([]);
      setNewMessage("");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSearching(false);
    }
  };

  const fetchMessages = async () => {
    if (!foundUser || !currentUserEmail) return;
    try {
      const result = await fetchAPI(
        `/(api)/chat/chat?withEmail=${foundUser.email}&currentEmail=${currentUserEmail}`,
      );
      if (result.error) throw new Error(result.error);
      setMessages(result.data);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !foundUser || !currentUserEmail) return;
    setSending(true);
    try {
      await fetchAPI(`/(api)/chat/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail: currentUserEmail,
          receiverEmail: foundUser.email,
          content: newMessage,
        }),
      });
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (foundUser && currentUserEmail) {
      fetchMessages();
    }
  }, [foundUser, currentUserEmail]);

  return (
    <SafeAreaView className="flex-1 bg-emerald-50 px-4 pt-2">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* 🟢 Email Search Bar */}
        <View className="mx-2 mb-4 bg-white rounded-full shadow-md shadow-emerald-200 px-4 py-2 flex-row items-center">
          <Image
            source={icons.search}
            className="w-5 h-5 mr-3"
            resizeMode="contain"
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Search user by email"
            placeholderTextColor="gray"
            editable={!searching}
            className="flex-1 text-base font-medium text-black"
          />
          <TouchableOpacity
            onPress={searchUser}
            disabled={searching}
            className="ml-3 bg-emerald-600 p-2 rounded-full"
          >
            <Ionicons name="search" color="white" size={18} />
          </TouchableOpacity>
        </View>

        {/* 🟢 Chat Display */}
        {foundUser && (
          <>
            <Text className="text-xl font-JakartaBold text-emerald-600 mb-2">
              Chat with {foundUser.name}
            </Text>

            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 200 }}
              renderItem={({ item }) => {
                const isCurrentUser = item.sender_email === currentUserEmail;
                return (
                  <View
                    className={`mb-2 px-4 py-2 rounded-xl max-w-[75%] ${
                      isCurrentUser
                        ? "bg-emerald-600 self-end rounded-br-none"
                        : "bg-white self-start rounded-bl-none border border-emerald-200"
                    }`}
                  >
                    <Text
                      className={`${
                        isCurrentUser ? "text-white" : "text-black"
                      } text-base`}
                    >
                      {item.content}
                    </Text>
                  </View>
                );
              }}
              ListEmptyComponent={
                <Text className="text-gray-400 text-center mt-10">
                  No messages yet.
                </Text>
              }
            />
          </>
        )}

        {/* 🟢 Input Bar */}
        {foundUser && (
          <View
            style={{
              position: "absolute",
              bottom: insets.bottom + TAB_BAR_HEIGHT,
              left: 16,
              right: 16,
            }}
            className="flex-row items-center justify-between bg-white shadow-md shadow-emerald-200 rounded-full px-4 py-2"
          >
            <View className="flex-row items-center flex-1">
              <Image
                source={icons.chat}
                className="w-5 h-5 mr-3"
                resizeMode="contain"
              />
              <TextInput
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Type a message"
                placeholderTextColor="gray"
                className="flex-1 text-base font-medium text-black"
              />
            </View>
            <TouchableOpacity
              onPress={sendMessage}
              disabled={sending || !newMessage.trim()}
              className="ml-3 bg-emerald-600 p-2 rounded-full"
            >
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
