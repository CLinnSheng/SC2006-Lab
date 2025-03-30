import { useMemo, useCallback } from "react";

const useBottomSheetAnimation = () => {
  const snapPoints = useMemo(() => ["10%", "45%", "93%"], []);

  const handleAnimate = useCallback((fromIndex: number, toIndex: number) => {
    console.log("handleAnimate", fromIndex, toIndex);

    // Prevent dragging below 10%
    if (toIndex === -1) {
      // Return value for caller to use
      return 1; // Snap back to 40% (or any other desired index)
    }

    return toIndex;
  }, []);

  return {
    snapPoints,
    handleAnimate,
  };
};

export default useBottomSheetAnimation;
