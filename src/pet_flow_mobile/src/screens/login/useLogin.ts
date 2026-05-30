import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { authService, authStorage } from '../../services';
import { useSession } from '../../contexts/SessionContext';
import { AuthRoutes } from '../../navigation/routes';

export function useLogin() {
  const navigation = useNavigation<any>();
  const { setSession } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormValid = email.length > 0 && password.length > 0;

  const togglePassword = () => setShowPassword(!showPassword);

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

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePassword,
    error,
    loading,
    isFormValid,
    handleLogin,
    goToRegister,
  };
}
