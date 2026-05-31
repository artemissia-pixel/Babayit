import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Apartment } from '@/constants/dummyApartments';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

interface Props {
  apartment: Apartment;
  onClose: () => void;
}

export const ApartmentCard: React.FC<Props> = ({ apartment, onClose }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imagePlaceholderText}>📷</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.price}>
            {t('apartment.price', { amount: apartment.price.toLocaleString('he-IL') })}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>{t('common.close')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.address}>{apartment.address}</Text>

        <View style={styles.details}>
          <DetailChip label={`${apartment.rooms} ${t('apartment.rooms')}`} />
          <DetailChip label={`${t('apartment.floor')} ${apartment.floor}`} />
          <DetailChip label={`${apartment.size} מ"ר`} />
        </View>

        <Text style={styles.available}>
          {t('apartment.available', { date: apartment.availableFrom })}
        </Text>

        {apartment.isBrokerage && (
          <View style={styles.brokerageBadge}>
            <Text style={styles.brokerageBadgeText}>תיווך</Text>
          </View>
        )}

        <TouchableOpacity style={styles.knockBtn}>
          <Text style={styles.knockBtnText}>{t('apartment.knocking')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DetailChip: React.FC<{ label: string }> = ({ label }) => (
  <View style={styles.chip}>
    <Text style={styles.chipText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: Colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    writingDirection: 'rtl',
  },
  imagePlaceholder: {
    height: 160,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 48,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'right',
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  address: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginBottom: 10,
  },
  details: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: {
    fontSize: 13,
    color: Colors.text,
    textAlign: 'right',
  },
  available: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginBottom: 12,
  },
  brokerageBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 12,
  },
  brokerageBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  knockBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  knockBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
