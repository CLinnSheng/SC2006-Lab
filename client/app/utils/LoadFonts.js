import * as Font from 'expo-font';

const loadFonts = async () => {
  await Font.loadAsync({
    "ArialRoundedBold": require("../../assets/fonts/ArialRoundedBold.ttf"),
    "DejaVuSansMono-BoldOblique": require("../../assets/fonts/DejaVuSansMono-BoldOblique.ttf"),
  });
};

export default loadFonts; 