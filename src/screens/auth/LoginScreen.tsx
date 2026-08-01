import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import { AppDispatch, RootState } from '../../store';
import { loginUser, loginWithOAuth2 } from '../../store/authSlice';
import { API_BASE_URL, OAUTH2_CALLBACK_URL } from '../../config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const LoginScreen = () => {
  const { theme, navigate } = useApp();
  const colors = COLORS[theme];
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();

  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // OAuth2 states
  const [showOAuthModal, setShowOAuthModal] = useState(false);
  const [webViewLoading, setWebViewLoading] = useState(false);

  const handleLogin = () => {
    let hasError = false;

    if (!email) {
      setEmailError('Vui lòng nhập email');
      hasError = true;
    } else if (!email.includes('@')) {
      setEmailError('Email không hợp lệ');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu');
      hasError = true;
    } else if (password.length < 4) {
      setPasswordError('Mật khẩu tối thiểu phải 4 ký tự');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) return;

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((data) => {
        Alert.alert(
          'Đăng nhập thành công',
          `Chào mừng ${data.user.fullName} quay trở lại!`
        );
        if (data.role === 'manager') {
          navigate('AdminHome');
        } else {
          navigate('StudentHome');
        }
      })
      .catch((err) => {
        Alert.alert('Đăng nhập thất bại', err || 'Mật khẩu hoặc tài khoản không chính xác');
      });
  };

  const handleWebViewNavigation = (navState: any) => {
    // Intercept when backend redirects to front-end callback url
    if (navState.url.startsWith(OAUTH2_CALLBACK_URL)) {
      setShowOAuthModal(false);
      
      // Request Redux to call the exchange token endpoint
      dispatch(loginWithOAuth2())
        .unwrap()
        .then((data) => {
          Alert.alert(
            'Đăng nhập thành công',
            `Chào mừng ${data.user.fullName} đăng nhập bằng Google!`
          );
          if (data.role === 'manager') {
            navigate('AdminHome');
          } else {
            navigate('StudentHome');
          }
        })
        .catch((err) => {
          Alert.alert('Đăng nhập với Google thất bại', err || 'Đăng nhập Google thất bại');
        });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top, SPACING.lg) }]} keyboardShouldPersistTaps="handled">
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigate('Welcome')}>
          <Icon name="back" color={colors.primary} size={20} />
          <Text style={[styles.backText, { color: colors.primary }]}>Quay lại</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Đăng Nhập</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Truy cập hệ thống quản lý phòng kí túc xá của bạn
          </Text>
        </View>

        {/* Form Inputs */}
        <View style={styles.form}>
          <Input
            label="Địa chỉ Email"
            placeholder="example@student.edu.vn"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            error={emailError}
            icon="mail"
          />

          <Input
            label="Mật khẩu"
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError('');
            }}
            error={passwordError}
            icon="lock"
          />

          <TouchableOpacity style={styles.forgotBtn} onPress={() => navigate('ForgotPassword')}>
            <Text style={[styles.forgotText, { color: colors.primary }]}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <Button
            title="Đăng Nhập"
            onPress={handleLogin}
            loading={isLoading}
            variant="primary"
            style={{ marginTop: SPACING.md }}
          />

          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>Hoặc</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Google Login Button */}
          <TouchableOpacity
            style={[styles.googleBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
            onPress={() => setShowOAuthModal(true)}
          >
            <Icon name="globe" color="#EA4335" size={18} />
            <Text style={[styles.googleBtnText, { color: colors.text }]}>Đăng nhập với Google</Text>
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={{ color: colors.textSecondary, fontSize: SIZES.fontSm }}>Chưa có tài khoản?</Text>
            <TouchableOpacity onPress={() => navigate('Register')}>
              <Text style={[styles.registerText, { color: colors.primary }]}> Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Google Login WebView Modal */}
      <Modal
        visible={showOAuthModal}
        animationType="slide"
        onRequestClose={() => setShowOAuthModal(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border, paddingTop: insets.top, height: 52 + insets.top }]}>
            <TouchableOpacity onPress={() => setShowOAuthModal(false)} style={styles.modalCloseBtn}>
              <Icon name="back" color={colors.text} size={22} />
              <Text style={[styles.modalCloseText, { color: colors.text }]}>Đóng</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Đăng nhập Google</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={{ flex: 1, position: 'relative' }}>
            <WebView
              source={{ uri: `${API_BASE_URL}/oauth2/authorization/google` }}
              onNavigationStateChange={handleWebViewNavigation}
              onLoadStart={() => setWebViewLoading(true)}
              onLoadEnd={() => setWebViewLoading(false)}
              sharedCookiesEnabled={true}
              thirdPartyCookiesEnabled={true}
              domStorageEnabled={true}
              javaScriptEnabled={true}
            />
            {webViewLoading && (
              <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loaderText, { color: colors.textSecondary }]}>Đang kết nối tới Google...</Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
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
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
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
  forgotBtn: {
    alignSelf: 'flex-end',
    paddingVertical: SPACING.xs,
  },
  forgotText: {
    fontSize: SIZES.fontSm,
    fontWeight: '500',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  registerText: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: SIZES.fontXs,
    fontWeight: '500',
  },
  googleBtn: {
    flexDirection: 'row',
    height: 48,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  googleBtnText: {
    fontSize: SIZES.fontSm,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    borderBottomWidth: 1,
    paddingHorizontal: SPACING.md,
  },
  modalCloseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  modalCloseText: {
    fontSize: SIZES.fontSm,
    fontWeight: '600',
    marginLeft: 2,
  },
  modalTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loaderText: {
    marginTop: SPACING.sm,
    fontSize: SIZES.fontSm,
  },
});
