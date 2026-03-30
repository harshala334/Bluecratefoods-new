import { Dimensions, PixelRatio, Platform } from 'react-native';

// Wait until necessary, to avoid top-level Dimensions evaluation issues on Web
const getWidth = () => Dimensions.get('window').width;
const getHeight = () => Dimensions.get('window').height;

// Guideline sizes are based on standard iPhone 14 (approx ~390x844)
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

const scale = (size: number) => {
  if (Platform.OS === 'web') return size; // Trust CSS/Browser pixel scaling
  return (getWidth() / guidelineBaseWidth) * size;
};

const verticalScale = (size: number) => {
  if (Platform.OS === 'web') return size;
  return (getHeight() / guidelineBaseHeight) * size;
};

const moderateScale = (size: number, factor = 0.5) => {
  if (Platform.OS === 'web') return size; // Avoid huge fonts on desktop
  return size + (scale(size) - size) * factor;
};

export { scale, verticalScale, moderateScale };
