import '../global.css';
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem("onboardingSeen");
      if (!seen) router.replace("/(onboarding)/welcome");
    })();
  }, []);

  return <Slot />;
}
