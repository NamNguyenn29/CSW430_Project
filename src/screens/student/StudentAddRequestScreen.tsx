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

export const StudentAddRequestScreen = () => {
  const { theme, addMaintenanceRequest, goBack } = useApp();
  const colors = COLORS[theme];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Điện' | 'Nước' | 'Thiết bị' | 'Khác'>('Điện');
  const [priority, setPriority] = useState<'Thấp' | 'Trung bình' | 'Cao'>('Trung bình');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Vui lòng điền tiêu đề yêu cầu';
    if (!description.trim()) newErrors.description = 'Vui lòng điền mô tả sự cố';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await addMaintenanceRequest(title, description, category, priority);
      setIsLoading(false);
      Alert.alert(
        'Gửi yêu cầu thành công',
        'Yêu cầu sửa chữa của bạn đã được tiếp nhận. Đội ngũ kỹ thuật sẽ sớm tiến hành sửa chữa!',
        [{ text: 'Xem danh sách', onPress: () => goBack() }]
      );
    } catch (e: any) {
      setIsLoading(false);
      Alert.alert('Thất bại', e.message || 'Không thể gửi yêu cầu sửa chữa.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Báo Cáo Hỏng Hóc" showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <View style={styles.form}>
          <Input
            label="Tiêu đề yêu cầu"
            placeholder="Ví dụ: Bóng đèn phòng tắm bị cháy"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
            }}
            error={errors.title}
            icon="✏️"
          />

          {/* Category Selector */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>Loại sự cố</Text>
          <View style={styles.selectorRow}>
            {(['Điện', 'Nước', 'Thiết bị', 'Khác'] as const).map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.selectorOption,
                  { borderColor: colors.border, backgroundColor: theme === 'light' ? '#FFFFFF' : '#1E293B' },
                  category === cat && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.selectorText, category === cat ? { color: '#FFF' } : { color: colors.text }]}>
                  {cat === 'Điện' ? '⚡ ' : cat === 'Nước' ? '💧 ' : cat === 'Thiết bị' ? '🚪 ' : '❓ '}
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Priority Selector */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>Mức độ ưu tiên</Text>
          <View style={styles.selectorRow}>
            {(['Thấp', 'Trung bình', 'Cao'] as const).map(prio => (
              <TouchableOpacity
                key={prio}
                style={[
                  styles.selectorOption,
                  { borderColor: colors.border, backgroundColor: theme === 'light' ? '#FFFFFF' : '#1E293B' },
                  priority === prio && {
                    backgroundColor: prio === 'Cao' ? colors.danger : prio === 'Trung bình' ? colors.warning : colors.success,
                    borderColor: prio === 'Cao' ? colors.danger : prio === 'Trung bình' ? colors.warning : colors.success,
                  }
                ]}
                onPress={() => setPriority(prio)}
              >
                <Text style={[styles.selectorText, priority === prio ? { color: '#FFF' } : { color: colors.text }]}>
                  {prio}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Mô tả sự cố chi tiết"
            placeholder="Mô tả cụ thể sự cố (Vị trí hỏng, hiện trạng xảy ra khi nào,...) để kĩ thuật viên chuẩn bị dụng cụ phù hợp."
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
            }}
            error={errors.description}
            inputStyle={styles.multilineInput}
            containerStyle={{ marginTop: SPACING.xs }}
          />

          <Button
            title="Gửi Yêu Cầu Sửa Chữa"
            onPress={handleSubmit}
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
    fontWeight: '500',
    marginTop: SPACING.sm,
    marginBottom: 8,
    marginLeft: 2,
  },
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  selectorOption: {
    flex: 1,
    minWidth: '22%',
    marginHorizontal: 2,
    height: 40,
    borderWidth: 1,
    borderRadius: SIZES.radiusSm,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  selectorText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  multilineInput: {
    height: 100,
    paddingTop: 12,
  },
});
