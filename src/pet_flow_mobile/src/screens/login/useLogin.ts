import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { authService, authStorage, authRequest } from '../../services';
import type { Employee } from '../../types';
import { useSession } from '../../contexts/SessionContext';
import { AuthRoutes } from '../../navigation/routes';

export function useLogin() {
  const navigation = useNavigation<any>();
  const { setSession } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormValid = email.length > 0 && password.length > 0;

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleRememberMe = () => setRememberMe(!rememberMe);

  const goToRegister = () => navigation.navigate(AuthRoutes.REGISTER);

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

      let clinicId = data.clinic_id || '';
      let name = 'Usuário';
      let role = '';

      try {
        const me = await authRequest<Employee>('/employee/me', { method: 'GET' });
        clinicId = me.clinicId || clinicId;
        name = me.name || 'Usuário';
        role = me.role || '';
      } catch {
        // fallback values already set
      }

      const sessionData = {
        token: data.token,
        userId: data.user_id,
        clinicId,
        name,
        role,
      };

      if (rememberMe) {
        await authStorage.saveSessionData(sessionData);
      }

      setSession(sessionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePassword,
    rememberMe,
    toggleRememberMe,
    error,
    loading,
    isFormValid,
    handleLogin,
    goToRegister,
  };
}
