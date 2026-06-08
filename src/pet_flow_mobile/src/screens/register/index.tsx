import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useRegister } from './useRegister';
import { styles } from '../login/styles';

export default function RegisterScreen() {
  const {
    clinicName,
    setClinicName,
    cnpj,
    setCnpj,
    phone,
    setPhone,
    address,
    setAddress,
    ownerName,
    setOwnerName,
    cpf,
    setCpf,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePassword,
    error,
    loading,
    isFormValid,
    handleRegister,
    goToLogin,
  } = useRegister();

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.logoContainer}>
            <MaterialIcons name="pets" size={48} color={colors.primary} />
            <Text style={styles.logoText}>
              pet<Text style={styles.logoTextFlow}>flow</Text>
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Crie sua conta</Text>
            <Text style={styles.subtitle}>Cadastre sua clínica e o responsável.</Text>

            <Text style={styles.label}>Nome da clínica:</Text>
            <TextInput
              style={styles.input}
              placeholder="Clínica Pet Feliz"
              placeholderTextColor={colors.textPlaceholder}
              value={clinicName}
              onChangeText={setClinicName}
            />

            <Text style={styles.label}>CNPJ:</Text>
            <TextInput
              style={styles.input}
              placeholder="00.000.000/0000-00"
              placeholderTextColor={colors.textPlaceholder}
              value={cnpj}
              onChangeText={setCnpj}
              keyboardType="numbers-and-punctuation"
            />

            <Text style={styles.label}>Telefone:</Text>
            <TextInput
              style={styles.input}
              placeholder="(00) 00000-0000"
              placeholderTextColor={colors.textPlaceholder}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Endereço:</Text>
            <TextInput
              style={styles.input}
              placeholder="Rua, número, bairro"
              placeholderTextColor={colors.textPlaceholder}
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.label}>Nome do responsável:</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome completo"
              placeholderTextColor={colors.textPlaceholder}
              value={ownerName}
              onChangeText={setOwnerName}
            />

            <Text style={styles.label}>CPF:</Text>
            <TextInput
              style={styles.input}
              placeholder="000.000.000-00"
              placeholderTextColor={colors.textPlaceholder}
              value={cpf}
              onChangeText={setCpf}
              keyboardType="numbers-and-punctuation"
            />

            <Text style={styles.label}>E-mail:</Text>
            <TextInput
              style={styles.input}
              placeholder="nome@petflow.com.br"
              placeholderTextColor={colors.textPlaceholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha:</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Mínimo de 6 caracteres"
                placeholderTextColor={colors.textPlaceholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={togglePassword}>
                <MaterialIcons
                  name={showPassword ? 'visibility-off' : 'visibility'}
                  size={20}
                  color={colors.textPlaceholder}
                />
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.button, !isFormValid && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <ActivityIndicator color={colors.textWhite} />
              ) : (
                <Text style={styles.buttonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerLink} onPress={goToLogin}>
              <Text style={styles.registerText}>
                Já tem uma conta? <Text style={styles.registerBold}>Entrar</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
