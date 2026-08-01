import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import api from '../../services/api';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const RegisterScreen = () => {
  const { theme, navigate } = useApp();
  const colors = COLORS[theme];
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [className, setClassName] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [password, setPassword] = useState('');
  const [registrationCode, setRegistrationCode] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const handleRequestCode = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Lỗi', 'Vui lòng điền địa chỉ email hợp lệ trước khi nhận mã xác minh.');
      return;
    }

    setIsSendingCode(true);
    try {
      await api.post('/api/request-code/register-code', email.trim(), {
        headers: { 'Content-Type': 'text/plain' }
      });
      Alert.alert('Thành công', 'Mã xác minh đã được gửi về email của bạn. Vui lòng kiểm tra hộp thư.');
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || 'Không thể gửi mã xác minh';
      Alert.alert('Lỗi', msg);
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleRegister = async () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Vui lòng nhập họ và tên';
    if (!studentId.trim()) newErrors.studentId = 'Vui lòng nhập mã sinh viên';
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!email.includes('@')) {
      newErrors.email = 'Email không đúng định dạng';
    }
    if (!phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!className.trim()) newErrors.className = 'Vui lòng nhập lớp sinh hoạt';
    if (!password || password.length < 6) newErrors.password = 'Mật khẩu phải từ 6 ký tự';
    if (!registrationCode.trim()) newErrors.registrationCode = 'Vui lòng nhập mã xác minh';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const requestPayload = {
        email: email.trim(),
        password,
        fullName: name.trim(),
        phoneNumber: phone.trim(),
        registrationCode: registrationCode.trim(),
        studentCode: studentId.trim(),
        major: className.trim(), // simple mapping
        identityNumber: '001202003004', // mock identity number
        startYear: 2022,
        endYear: 2026,
        sleepTime: '23:00',
        wakeUpTime: '07:00',
        sleepRhythmScore: 5,
        wakeRhythmScore: 5,
      };

      const formData = new FormData();
      formData.append('request', JSON.stringify(requestPayload));

      const hostFileUri = Platform.OS === 'android' ? 'file:///system/etc/hosts' : 'file:///etc/hosts';
      
      formData.append('citizenIdFile', {
        uri: hostFileUri,
        type: 'text/plain',
        name: 'citizenId.txt',
      } as any);

      formData.append('studentCardFile', {
        uri: hostFileUri,
        type: 'text/plain',
        name: 'studentCard.txt',
      } as any);

      await api.post('/api/v1/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      Alert.alert(
        'Đăng ký thành công',
        'Tài khoản lưu trú của bạn đã được khởi tạo và gửi duyệt thành công!',
        [{ text: 'Đăng nhập', onPress: () => navigate('Login') }]
      );
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || 'Đăng ký thất bại';
      Alert.alert('Đăng ký không thành công', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top, SPACING.lg) }]} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backBtn} onPress={() => navigate('Login')}>
          <Icon name="back" color={colors.primary} size={20} />
          <Text style={[styles.backText, { color: colors.primary }]}>Quay lại</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Đăng Ký Lưu Trú</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Khởi tạo đơn lưu trú tại Kí túc xá
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Họ và Tên sinh viên"
            placeholder="Nguyễn Văn A"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
            }}
            error={errors.name}
            icon="profile"
          />

          <Input
            label="Mã số Sinh viên (MSSV)"
            placeholder="B22DCCN001"
            autoCapitalize="characters"
            value={studentId}
            onChangeText={(text) => {
              setStudentId(text);
              if (errors.studentId) setErrors(prev => ({ ...prev, studentId: '' }));
            }}
            error={errors.studentId}
            icon="info"
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: SPACING.sm }}>
              <Input
                label="Lớp học / Chuyên ngành"
                placeholder="CNTT / D22CQCN01-B"
                autoCapitalize="characters"
                value={className}
                onChangeText={(text) => {
                  setClassName(text);
                  if (errors.className) setErrors(prev => ({ ...prev, className: '' }));
                }}
                error={errors.className}
                icon="room"
              />
            </View>

            <View style={{ width: 120, marginVertical: SPACING.xs }}>
              <Text style={[styles.genderLabel, { color: colors.textSecondary }]}>Giới tính</Text>
              <View style={[styles.genderContainer, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <TouchableOpacity
                  style={[styles.genderOption, gender === 'Nam' && { backgroundColor: colors.primary }]}
                  onPress={() => setGender('Nam')}
                >
                  <Text style={[styles.genderText, gender === 'Nam' ? { color: '#FFF' } : { color: colors.text }]}>Nam</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderOption, gender === 'Nữ' && { backgroundColor: colors.primary }]}
                  onPress={() => setGender('Nữ')}
                >
                  <Text style={[styles.genderText, gender === 'Nữ' ? { color: '#FFF' } : { color: colors.text }]}>Nữ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Input
            label="Số điện thoại liên hệ"
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
            label="Địa chỉ Email"
            placeholder="example@student.edu.vn"
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

          <Input
            label="Mật khẩu tài khoản"
            placeholder="•••••••• (tối thiểu 6 ký tự)"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
            }}
            error={errors.password}
            icon="lock"
          />

          <View style={styles.codeRow}>
            <View style={{ flex: 1, marginRight: SPACING.sm }}>
              <Input
                label="Mã xác minh Email"
                placeholder="123456"
                keyboardType="number-pad"
                value={registrationCode}
                onChangeText={(text) => {
                  setRegistrationCode(text);
                  if (errors.registrationCode) setErrors(prev => ({ ...prev, registrationCode: '' }));
                }}
                error={errors.registrationCode}
                icon="info"
              />
            </View>
            <TouchableOpacity
              onPress={handleRequestCode}
              disabled={isSendingCode}
              style={[styles.codeBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.codeBtnText}>
                {isSendingCode ? 'Đang gửi...' : 'Nhận mã'}
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Gửi Đơn Đăng Ký"
            onPress={handleRegister}
            loading={isLoading}
            variant="primary"
            style={{ marginTop: SPACING.md }}
          />

          <View style={styles.loginRow}>
            <Text style={{ color: colors.textSecondary, fontSize: SIZES.fontSm }}>Đã có tài khoản?</Text>
            <TouchableOpacity onPress={() => navigate('Login')}>
              <Text style={[styles.loginText, { color: colors.primary }]}> Đăng nhập</Text>
            </TouchableOpacity>
          </View>
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
    padding: SPACING.lg,
    flexGrow: 1,
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
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: SIZES.fontTitle,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: SIZES.fontSm,
    marginTop: 4,
  },
  form: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  genderLabel: {
    fontSize: SIZES.fontXs,
    fontWeight: '600',
    marginBottom: 4,
  },
  genderContainer: {
    flexDirection: 'row',
    height: 48,
    borderWidth: 1,
    borderRadius: SIZES.radiusMd,
    padding: 3,
  },
  genderOption: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.radiusSm - 2,
  },
  genderText: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: SPACING.sm,
  },
  codeBtn: {
    height: 48,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  codeBtnText: {
    color: '#FFFFFF',
    fontSize: SIZES.fontSm,
    fontWeight: '700',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  loginText: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
  },
});
