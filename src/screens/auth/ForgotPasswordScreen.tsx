import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ForgotPasswordScreen = () => {
  const { theme, navigate } = useApp();
  const colors = COLORS[theme];
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = () => {
    if (!email) {
      setError('Vui lòng nhập email');
      return;
    } else if (!email.includes('@')) {
      setError('Email không đúng định dạng');
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Đã gửi liên kết',
        'Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu tới email của bạn. Vui lòng kiểm tra hộp thư đến.',
        [{ text: 'Quay lại Đăng nhập', onPress: () => navigate('Login') }]
      );
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { paddingTop: Math.max(insets.top, SPACING.lg) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigate('Login')}>
          <Icon name="back" color={colors.primary} size={20} />
          <Text style={[styles.backText, { color: colors.primary }]}>Quay lại</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Quên Mật Khẩu?</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Nhập email tài khoản của bạn để nhận liên kết đặt lại mật khẩu mới.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Địa chỉ Email của bạn"
            placeholder="example@student.edu.vn"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError('');
            }}
            error={error}
            icon="mail"
          />

          <Button
            title="Gửi Yêu Cầu Khôi Phục"
            onPress={handleResetPassword}
            loading={isLoading}
            variant="primary"
            style={{ marginTop: SPACING.md }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    flex: 1,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: SPACING.xs,
  },
  backText: {
    fontSize: SIZES.fontSm,
    fontWeight: '600',
    marginLeft: 4,
  },
  header: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: SIZES.fontTitle,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: SIZES.fontSm,
    marginTop: 6,
    lineHeight: 20,
  },
  form: {
    width: '100%',
  },
});
