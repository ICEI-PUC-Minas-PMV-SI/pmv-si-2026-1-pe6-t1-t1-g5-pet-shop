import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { authStorage } from '../../services/auth';

function translateError(msg: string): string {
  const translations: Record<string, string> = {
    'Invalid login credentials': 'E-mail ou senha inválidos.',
    'User not found': 'Usuário não encontrado.',
    'Incorrect password': 'Senha incorreta.',
  };
  return translations[msg] || msg;
}

export function useLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!error && !emailError) return;
    const timer = setTimeout(() => {
      setError('');
      setEmailError('');
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, emailError]);

  const validateEmail = (value: string): boolean => {
    if (value && !value.endsWith('@petflow.com.br')) {
      setEmailError('O e-mail deve ter o formato @petflow.com.br');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) {
      validateEmail(value);
    }
  };

  const handleEmailBlur = () => {
    if (email) {
      validateEmail(email);
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    if (!email || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(email, password);
      authStorage.save(data, remember);
      navigate('/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao fazer login.';
      setError(translateError(msg));
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email.length > 0 && password.length > 0;

  return {
    email,
    password,
    remember,
    error,
    emailError,
    showPassword,
    loading,
    isFormValid,
    setPassword,
    setRemember,
    handleEmailChange,
    handleEmailBlur,
    togglePassword,
    handleSubmit,
  };
}
