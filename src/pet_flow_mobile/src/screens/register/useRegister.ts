import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { authService, authStorage, authRequest } from '../../services';
import type { Employee } from '../../types';
import { useSession } from '../../contexts/SessionContext';
import { AuthRoutes } from '../../navigation/routes';

export function useRegister() {
  const navigation = useNavigation<any>();
  const { setSession } = useSession();

  const [clinicName, setClinicName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const isFormValid =
    clinicName.trim().length > 0 &&
    ownerName.trim().length > 0 &&
    email.length > 0 &&
    password.length > 0;

  const goToLogin = () => navigation.navigate(AuthRoutes.LOGIN);

  const handleRegister = async () => {
    setError('');

    if (!clinicName.trim() || !ownerName.trim() || !email || !password) {
      setError('Preencha os campos obrigatórios.');
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
      let data = await authService.register({
        clinicName: clinicName.trim(),
        cnpj: cnpj.trim(),
        phone: phone.trim(),
        address: address.trim(),
        ownerName: ownerName.trim(),
        cpf: cpf.trim(),
        email,
        password,
      });

      // Caso o cadastro não retorne sessão (ex.: confirmação de e-mail),
      // autentica em seguida para obter um token válido.
      if (!data.token) {
        data = await authService.login(email, password);
      }

      await authStorage.save(data);

      let clinicId = data.clinic_id || '';
      let name = ownerName.trim();
      let role = 'dono';

      try {
        const me = await authRequest<Employee>('/employee/me', { method: 'GET' });
        clinicId = me.clinicId || clinicId;
        name = me.name || name;
        role = me.role || role;
      } catch {
        // mantém os valores já definidos a partir do cadastro
      }

      const sessionData = { token: data.token, userId: data.user_id, clinicId, name, role };

      await authStorage.saveSessionData(sessionData);
      setSession(sessionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
