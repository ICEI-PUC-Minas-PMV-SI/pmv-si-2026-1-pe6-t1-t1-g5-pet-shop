import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { authService, authStorage } from '../services';
import { useSession } from '../contexts/SessionContext';
import { colors, spacing, fontSize, fontWeight, radius, opacity } from '../theme';
import { AuthRoutes } from '../navigation/routes';

const dogImg = require('../../assets/dog_register.png');

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { setSession } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }

    if (!email.endsWith('@petflow.com.br')) {
      setError('O e-mail deve ter o formato @petflow.com.br');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(email, password);
      await authStorage.save(data);
      setSession({
        token: data.token,
        userId: data.user_id,
        clinicId: data.clinic_id || '',
        name: 'Usuário',
        role: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={dogImg} style={styles.bgImage} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            <Text style={styles.title}>Bem vindo de volta!</Text>
            <Text style={styles.subtitle}>Faça login para acessar sua conta.</Text>

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="nome@petflow.com.br"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Digite sua senha..."
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? 'visibility-off' : 'visibility'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.button, (!email || !password) && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading || !email || !password}
            >
              {loading ? (
                <ActivityIndicator color={colors.textWhite} />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate(AuthRoutes.REGISTER)}>
              <Text style={styles.registerText}>
                Não tem uma conta? <Text style={styles.registerBold}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
  },
  bgImage: {
    position: 'absolute',
    bottom: 0,
    right: -20,
    width: 280,
    height: 350,
    opacity: opacity.bgImage,
    resizeMode: 'contain',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: 60,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: `rgba(255,255,255,${opacity.subtitleText})`,
    marginBottom: 36,
  },
  label: {
    fontSize: fontSize.md,
    color: colors.textWhite,
    marginBottom: spacing.sm,
    fontWeight: fontWeight.regular,
  },
  input: {
    backgroundColor: colors.bgWhite,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgWhite,
    borderRadius: radius.sm,
    marginBottom: spacing.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  eyeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  error: {
    color: colors.textWhite,
    backgroundColor: 'rgba(255,60,60,0.85)',
    padding: spacing.md,
    borderRadius: radius.sm,
    fontSize: fontSize.sm,
    marginBottom: spacing.lg,
    fontWeight: fontWeight.medium,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: colors.primaryDark,
    borderRadius: 7,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonDisabled: {
    opacity: opacity.disabled,
  },
  buttonText: {
    color: colors.textWhite,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  registerLink: {
    marginTop: spacing.xxl,
    alignItems: 'center',
  },
  registerText: {
    fontSize: fontSize.sm,
    color: `rgba(255,255,255,${opacity.mutedText})`,
  },
  registerBold: {
    color: colors.primaryDark,
    fontWeight: fontWeight.semibold,
  },
});
