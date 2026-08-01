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
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../components/Header';
import { COLORS, SIZES, SPACING } from '../../theme/theme';

export const AdminAddInvoiceScreen = () => {
  const { theme, rooms, addInvoice, goBack, screenParams } = useApp();
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

  const handleCreateInvoice = () => {
    const rentNum = parseFloat(rentFee);
    const elecNum = parseFloat(elecFee);
    const waterNum = parseFloat(waterFee);
    const serviceNum = parseFloat(serviceFee);

    const newErrors: Record<string, string> = {};
    if (!selectedRoomId) newErrors.roomId = 'Vui lòng chọn phòng để lập hóa đơn';
    if (isNaN(rentNum) || rentNum < 0) newErrors.rentFee = 'Tiền phòng không hợp lệ';
    if (isNaN(elecNum) || elecNum < 0) newErrors.electricityFee = 'Tiền điện không hợp lệ';
    if (isNaN(waterNum) || waterNum < 0) newErrors.waterFee = 'Tiền nước không hợp lệ';
    if (isNaN(serviceNum) || serviceNum < 0) newErrors.serviceFee = 'Tiền dịch vụ không hợp lệ';
    if (!month.trim()) newErrors.month = 'Vui lòng nhập kỳ hóa đơn';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      addInvoice(selectedRoomId, rentNum, elecNum, waterNum, serviceNum, month);
      
      const targetRoom = rooms.find(r => r.id === selectedRoomId);
      Alert.alert(
        'Tạo hóa đơn thành công',
        `Đã lập hóa đơn ${month} thành công cho phòng ${targetRoom?.name}!`,
        [{ text: 'Hoàn tất', onPress: () => goBack() }]
      );
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Lập Hóa Đơn Mới" showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <View style={styles.form}>
          {/* Room Selector */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>Chọn phòng lập hóa đơn</Text>
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
                  {room.name} ({room.block})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.roomId && <Text style={[styles.errorText, { color: colors.danger }]}>{errors.roomId}</Text>}

          <Input
            label="Kỳ hóa đơn (tháng/năm)"
            placeholder="Tháng 07/2026"
            value={month}
            onChangeText={(text) => {
              setMonth(text);
              if (errors.month) setErrors(prev => ({ ...prev, month: '' }));
            }}
            error={errors.month}
            icon="📅"
          />

          <Input
            label="Tiền phòng (đ)"
            placeholder="1200000"
            keyboardType="numeric"
            value={rentFee}
            onChangeText={(text) => {
              setRentFee(text);
              if (errors.rentFee) setErrors(prev => ({ ...prev, rentFee: '' }));
            }}
            error={errors.rentFee}
            icon="💵"
          />

          <Input
            label="Tiền điện sử dụng (đ)"
            placeholder="350000"
            keyboardType="numeric"
            value={elecFee}
            onChangeText={(text) => {
              setElecFee(text);
              if (errors.electricityFee) setErrors(prev => ({ ...prev, electricityFee: '' }));
            }}
            error={errors.electricityFee}
            icon="⚡"
          />

          <Input
            label="Tiền nước sử dụng (đ)"
            placeholder="120000"
            keyboardType="numeric"
            value={waterFee}
            onChangeText={(text) => {
              setWaterFee(text);
              if (errors.waterFee) setErrors(prev => ({ ...prev, waterFee: '' }));
            }}
            error={errors.waterFee}
            icon="💧"
          />

          <Input
            label="Phí dịch vụ (Wifi, vệ sinh) (đ)"
            placeholder="100000"
            keyboardType="numeric"
            value={serviceFee}
            onChangeText={(text) => {
              setServiceFee(text);
              if (errors.serviceFee) setErrors(prev => ({ ...prev, serviceFee: '' }));
            }}
            error={errors.serviceFee}
            icon="🛠️"
          />

          <Button
            title="Lập Hóa Đơn & Phát Hành"
            onPress={handleCreateInvoice}
            loading={isLoading}
            variant="primary"
            style={{ marginTop: SPACING.md, marginBottom: SPACING.xl }}
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
    fontWeight: '500',
    marginBottom: 8,
    marginLeft: 2,
  },
  roomsScroll: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  roomTab: {
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginVertical: 4,
  },
  roomTabText: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: SIZES.fontXs,
    marginTop: -4,
    marginBottom: 8,
    marginLeft: 2,
  },
});
