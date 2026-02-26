import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard iPhone 14 (approx ~390x844)
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;

/**
 * moderateScale
 * Styles that scale with screen size but settle down on larger screens to avoid scaling too much.
 * Good for padding, font sizes, margins.
 * @param size - The size to scale
 * @param factor - Scaling factor (default 0.5) - 0 = no scale, 1 = linear scale
 */
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export { scale, verticalScale, moderateScale };
