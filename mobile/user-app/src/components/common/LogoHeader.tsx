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
      <View style={styles.logoIcon}>
        <Image
          source={{ uri: `${CDN_URL}/eatee_logo.jpg` }}
          style={styles.logoImage}
          resizeMode="cover"
        />
      </View>
      {/* <View style={styles.textContainer}>
        <Text style={styles.brandName}>Eatee</Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoIcon: {
    width: 100,
    height: 40,
    borderRadius: 25,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  textContainer: {
    justifyContent: 'center',
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
