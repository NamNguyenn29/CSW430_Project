import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../components/Header';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import { t, formatRoomTitle } from '../../i18n/translations';

export const AdminAddInvoiceScreen = () => {
  const { theme, language, rooms, addInvoice, goBack, screenParams } = useApp();
  const colors = COLORS[theme];

  const preselectedRoomId = screenParams?.preselectedRoomId || '';
  const [selectedRoomId, setSelectedRoomId] = useState(preselectedRoomId || (rooms[0]?.id || ''));

  const [rentFee, setRentFee] = useState('1200000');
  const [elecFee, setElecFee] = useState('350000');
  const [waterFee, setWaterFee] = useState('120000');
  const [serviceFee, setServiceFee] = useState('100000');
  const [month, setMonth] = useState('Tháng 07/2026');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateInvoice = async () => {
    const rentNum = parseFloat(rentFee);
    const elecNum = parseFloat(elecFee);
    const waterNum = parseFloat(waterFee);
    const serviceNum = parseFloat(serviceFee);

    const newErrors: Record<string, string> = {};
    if (!selectedRoomId) newErrors.roomId = language === 'en' ? 'Please select a room' : 'Vui lòng chọn phòng để lập hóa đơn';
    if (isNaN(rentNum) || rentNum < 0) newErrors.rentFee = language === 'en' ? 'Invalid room rent' : 'Tiền phòng không hợp lệ';
    if (isNaN(elecNum) || elecNum < 0) newErrors.electricityFee = language === 'en' ? 'Invalid electricity fee' : 'Tiền điện không hợp lệ';
    if (isNaN(waterNum) || waterNum < 0) newErrors.waterFee = language === 'en' ? 'Invalid water fee' : 'Tiền nước không hợp lệ';
    if (isNaN(serviceNum) || serviceNum < 0) newErrors.serviceFee = language === 'en' ? 'Invalid service fee' : 'Tiền dịch vụ không hợp lệ';
    if (!month.trim()) newErrors.month = language === 'en' ? 'Please enter billing period' : 'Vui lòng nhập kỳ hóa đơn';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await addInvoice(selectedRoomId, rentNum, elecNum, waterNum, serviceNum, month);
      setIsLoading(false);

      if (res?.success) {
        const targetRoom = rooms.find(r => r.id === selectedRoomId);
        Alert.alert(
          t('success', language),
          language === 'en'
            ? `Invoice created for ${formatRoomTitle(targetRoom?.name || '', language)} (${month})!`
            : `Đã lập hóa đơn ${month} thành công cho ${formatRoomTitle(targetRoom?.name || '', 'vi')}!`,
          [{ text: t('done', language), onPress: () => goBack() }]
        );
      } else {
        Alert.alert(
          t('error', language),
          res?.message || (language === 'en' ? 'Failed to create invoice.' : 'Không thể lập hóa đơn.')
        );
      }
    } catch (err: any) {
      setIsLoading(false);
      Alert.alert(
        t('error', language),
        err.message || (language === 'en' ? 'Failed to create invoice.' : 'Không thể lập hóa đơn.')
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('createInvoice', language)} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <View style={styles.form}>
          {/* Room Selector */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>{language === 'en' ? 'Select Room' : 'Chọn phòng lập hóa đơn'}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomsScroll}>
            {rooms.map(room => (
              <TouchableOpacity
                key={room.id}
                style={[
                  styles.roomTab,
                  { borderColor: colors.border, backgroundColor: theme === 'light' ? '#FFFFFF' : '#1E293B' },
                  selectedRoomId === room.id && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => setSelectedRoomId(room.id)}
              >
                <Text style={[styles.roomTabText, selectedRoomId === room.id ? { color: '#FFF' } : { color: colors.text }]}>
                  {formatRoomTitle(room.name, language)} ({room.block})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.roomId && <Text style={[styles.errorText, { color: colors.danger }]}>{errors.roomId}</Text>}

          <Input
            label={t('billingPeriod', language)}
            placeholder="Tháng 07/2026"
            value={month}
            onChangeText={(text) => {
              setMonth(text);
              if (errors.month) setErrors(prev => ({ ...prev, month: '' }));
            }}
            error={errors.month}
            icon="calendar"
          />

          <Input
            label={`${t('rentFee', language)} (đ)`}
            placeholder="1200000"
            keyboardType="numeric"
            value={rentFee}
            onChangeText={(text) => {
              setRentFee(text);
              if (errors.rentFee) setErrors(prev => ({ ...prev, rentFee: '' }));
            }}
            error={errors.rentFee}
            icon="dollar"
          />

          <Input
            label={`${t('electricityFee', language)} (đ)`}
            placeholder="350000"
            keyboardType="numeric"
            value={elecFee}
            onChangeText={(text) => {
              setElecFee(text);
              if (errors.electricityFee) setErrors(prev => ({ ...prev, electricityFee: '' }));
            }}
            error={errors.electricityFee}
            icon="zap"
          />

          <Input
            label={`${t('waterFee', language)} (đ)`}
            placeholder="120000"
            keyboardType="numeric"
            value={waterFee}
            onChangeText={(text) => {
              setWaterFee(text);
              if (errors.waterFee) setErrors(prev => ({ ...prev, waterFee: '' }));
            }}
            error={errors.waterFee}
            icon="droplet"
          />

          <Input
            label={`${t('serviceFee', language)} (đ)`}
            placeholder="100000"
            keyboardType="numeric"
            value={serviceFee}
            onChangeText={(text) => {
              setServiceFee(text);
              if (errors.serviceFee) setErrors(prev => ({ ...prev, serviceFee: '' }));
            }}
            error={errors.serviceFee}
            icon="settings"
          />

          <Button
            title={t('createInvoice', language)}
            onPress={handleCreateInvoice}
            loading={isLoading}
            variant="primary"
            style={{ marginTop: SPACING.lg }}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  roomsScroll: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  roomTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: SIZES.radiusSm,
    marginRight: 6,
  },
  roomTabText: {
    fontSize: SIZES.fontXs,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: SIZES.fontXs,
    marginBottom: SPACING.xs,
  },
});
