import { useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import LaunchScreen from "./screen/LaunchScreen";
import { UserLocationContext } from "./context/userLocation";

export default function Launch() {
  const router = useRouter();
  const { initializeAfterLaunch, initialProcessedPayload } =
    useContext(UserLocationContext);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Show the full animation before asking for location permission
  const handleAnimationComplete = () => {
    console.log("Animation completed");
    setAnimationComplete(true);
  };

  // After animation complete set user location
  useEffect(() => {
    if (animationComplete) {
      console.log("Starting location initialization...");
      initializeAfterLaunch(); // Initialize the location and payload
    }
  }, [animationComplete]);

  // Only navigate to home screen after userlocation and payload is set
  useEffect(() => {
    if (initialProcessedPayload !== null) {
      console.log("Payload loaded, navigating to home");
      router.replace("/home");
    }
  }, [initialProcessedPayload]);

  return <LaunchScreen onAnimationComplete={handleAnimationComplete} />;
}
