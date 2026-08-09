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
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import { t } from '../../i18n/translations';

export const StudentAddRequestScreen = () => {
  const { theme, language, addMaintenanceRequest, goBack } = useApp();
  const colors = COLORS[theme];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Điện' | 'Nước' | 'Thiết bị' | 'Khác'>('Điện');
  const [priority, setPriority] = useState<'Thấp' | 'Trung bình' | 'Cao'>('Trung bình');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = language === 'en' ? 'Please enter request title' : 'Vui lòng điền tiêu đề yêu cầu';
    if (!description.trim()) newErrors.description = language === 'en' ? 'Please enter detailed description' : 'Vui lòng điền mô tả sự cố';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await addMaintenanceRequest(title, description, category, priority);
      setIsLoading(false);
      Alert.alert(
        t('success', language),
        language === 'en'
          ? 'Your repair request has been submitted successfully!'
          : 'Yêu cầu sửa chữa của bạn đã được tiếp nhận. Đội ngũ kỹ thuật sẽ sớm tiến hành sửa chữa!',
        [{ text: 'OK', onPress: () => goBack() }]
      );
    } catch (e: any) {
      setIsLoading(false);
      Alert.alert(t('error', language), e.message || 'Không thể gửi yêu cầu sửa chữa.');
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Điện':
        return 'zap';
      case 'Nước':
        return 'droplet';
      case 'Thiết bị':
        return 'wrench';
      default:
        return 'alert';
    }
  };

  const getCategoryLabel = (cat: string) => {
    if (language === 'en') {
      if (cat === 'Điện') return 'Electricity';
      if (cat === 'Nước') return 'Water';
      if (cat === 'Thiết bị') return 'Equipment';
      if (cat === 'Khác') return 'Other';
    }
    return cat;
  };

  const getPriorityLabel = (prio: string) => {
    if (language === 'en') {
      if (prio === 'Thấp') return 'Low';
      if (prio === 'Trung bình') return 'Medium';
      if (prio === 'Cao') return 'High';
    }
    return prio;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('reportBroken', language)} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <View style={styles.form}>
          <Input
            label={t('incidentTitle', language)}
            placeholder={language === 'en' ? 'e.g. Bathroom light bulb burned out' : 'Ví dụ: Bóng đèn phòng tắm bị cháy'}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
            }}
            error={errors.title}
            icon="edit"
          />

          {/* Category Selector */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>{t('incidentType', language)}</Text>
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
                <View style={styles.categoryItem}>
                  <Icon
                    name={getCategoryIcon(cat) as any}
                    size={14}
                    color={category === cat ? '#FFF' : colors.primary}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[styles.selectorText, category === cat ? { color: '#FFF' } : { color: colors.text }]}>
                    {getCategoryLabel(cat)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Priority Selector */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>{t('priority', language)}</Text>
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
                  {getPriorityLabel(prio)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label={t('incidentDesc', language)}
            placeholder={language === 'en' ? 'Describe the incident in detail (location, when it occurred, etc.)...' : 'Mô tả cụ thể sự cố (Vị trí hỏng, hiện trạng xảy ra khi nào,...) để kĩ thuật viên chuẩn bị dụng cụ phù hợp.'}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
            }}
            error={errors.description}
            inputStyle={{ height: 100, textAlignVertical: 'top' }}
          />

          <Button
            title={t('submitRequest', language)}
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
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  selectorOption: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: SIZES.radiusSm,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorText: {
    fontSize: SIZES.fontXs,
    fontWeight: 'bold',
  },
});
