import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../components/Header';
import { COLORS, SIZES, SPACING } from '../../theme/theme';

export const EditProfileScreen = () => {
  const { theme, currentUser, updateUserProfile, goBack } = useApp();
  const colors = COLORS[theme];

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Vui lòng nhập họ và tên';
    if (!phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Email không hợp lệ';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      updateUserProfile(name, phone, email);
      Alert.alert(
        'Đã cập nhật',
        'Thông tin cá nhân của bạn đã được cập nhật thành công trên hệ thống!',
        [{ text: 'OK', onPress: () => goBack() }]
      );
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Chỉnh Sửa Hồ Sơ" showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <View style={styles.form}>
          <Input
            label="Họ và Tên"
            placeholder="Nguyễn Văn A"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
            }}
            error={errors.name}
            icon="👤"
          />

          <Input
            label="Số điện thoại"
            placeholder="0912345678"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
            }}
            error={errors.phone}
            icon="📞"
          />

          <Input
            label="Địa chỉ Email"
            placeholder="anguyen@student.edu.vn"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
            }}
            error={errors.email}
            icon="✉️"
          />

          {currentUser.studentId && (
            <Input
              label="Mã số sinh viên (Không thể thay đổi)"
              value={currentUser.studentId}
              editable={false}
              icon="🆔"
              containerStyle={{ opacity: 0.7 }}
            />
          )}

          {currentUser.roomName && (
            <Input
              label="Phòng kí túc xá (Do quản lý xếp)"
              value={`${currentUser.block} - ${currentUser.roomName}`}
              editable={false}
              icon="🏢"
              containerStyle={{ opacity: 0.7 }}
            />
          )}

          <Button
            title="Lưu Thay Đổi"
            onPress={handleSave}
            loading={isSaving}
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
});
