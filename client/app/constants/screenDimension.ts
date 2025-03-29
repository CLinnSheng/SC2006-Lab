import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const SCREEN_DIMENSIONS = {
  width,
  height,
};

export default SCREEN_DIMENSIONS;