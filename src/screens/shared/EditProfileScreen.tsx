import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../components/Header';
import { COLORS, SPACING } from '../../theme/theme';
import { t } from '../../i18n/translations';

export const EditProfileScreen = () => {
  const { theme, language, currentUser, updateUserProfile, goBack } = useApp();
  const colors = COLORS[theme];

  const [name, setName] = useState(currentUser?.fullName || currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phoneNumber || currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = language === 'en' ? 'Please enter full name' : 'Vui lòng nhập họ và tên';
    if (!phone.trim()) newErrors.phone = language === 'en' ? 'Please enter phone number' : 'Vui lòng nhập số điện thoại';
    if (!email.trim() || !email.includes('@')) newErrors.email = language === 'en' ? 'Invalid email address' : 'Email không hợp lệ';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      updateUserProfile(name, phone, email);
      Alert.alert(
        t('success', language),
        language === 'en' ? 'Profile updated successfully!' : 'Thông tin cá nhân của bạn đã được cập nhật thành công trên hệ thống!',
        [{ text: 'OK', onPress: () => goBack() }]
      );
    }, 800);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('editProfile', language)} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <View style={styles.form}>
          <Input
            label={t('fullName', language)}
            placeholder="Nguyen Van A"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
            }}
            error={errors.name}
            icon="profile"
          />

          <Input
            label={t('phoneNumber', language)}
            placeholder="0912345678"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
            }}
            error={errors.phone}
            icon="phone"
          />

          <Input
            label={t('email', language)}
            placeholder="anguyen@student.edu.vn"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
            }}
            error={errors.email}
            icon="mail"
          />

          {currentUser?.studentId && (
            <Input
              label={language === 'en' ? 'Student ID (Read only)' : 'Mã số sinh viên (Không thể thay đổi)'}
              value={currentUser.studentId}
              editable={false}
              icon="info"
              containerStyle={{ opacity: 0.7 }}
            />
          )}

          {currentUser?.roomName && (
            <Input
              label={language === 'en' ? 'Assigned Dorm Room' : 'Phòng kí túc xá (Do quản lý xếp)'}
              value={`${currentUser.block} - ${currentUser.roomName}`}
              editable={false}
              icon="building"
              containerStyle={{ opacity: 0.7 }}
            />
          )}

          <Button
            title={t('saveChanges', language)}
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
