import { CDN_URL } from '../../constants/config';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

/**
 * Logo Header Component
 * Brand logo/name for navigation headers
 */

export const LogoHeader = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/new_logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
      <Text style={styles.brandName}>Blue Crate</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2, // Removed gap completely
  },
  logoImage: {
    width: 60, // Reduced width to tighten the box
    height: 35,
    marginLeft: -15, // Aggressively pull left
    marginRight: -12, // Aggressively pull text in
  },
  brandName: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.display,
    fontWeight: '700' as const,
    color: colors.white,
    lineHeight: 20,
  },
  tagline: {
    fontSize: typography.fontSize.xs,
    color: colors.white,
    opacity: 0.9,
    lineHeight: 14,
  },
});

export default LogoHeader;
