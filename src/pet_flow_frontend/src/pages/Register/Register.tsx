import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { authStorage } from '../../services/auth';
import { clinicsService } from '../../services/clinic.services';
import { employeeService } from '../../services/employee';
import dogImg from '../../assets/dog_register.png';
import logoImg from '../../assets/logo-petflow.png';
import styles from './Register.module.css';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    clinicName: '',
    cnpj: '',
    fullName: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.clinicName || !form.cnpj || !form.fullName || !form.email || !form.password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      // 1. Cria o usuário de autenticação
      const authData = await authService.register({
        email: form.email,
        password: form.password,
        name: form.fullName,
      });
      authStorage.save(authData, true);

      // 2. Verifica se já existe uma clínica com o CNPJ informado
      let clinic: import('../../services/clinic.services').Clinic | undefined;

      const allClinics = await clinicsService.getAll();
      const existing = allClinics.find(
        (c) => c.cnpj.replace(/\D/g, '') === form.cnpj.replace(/\D/g, '')
      );

      if (existing) {
        // CNPJ já existe → reutiliza a clínica existente
        clinic = existing;
      } else {
        // CNPJ não existe → cria uma nova clínica
        clinic = await clinicsService.create({
          name: form.clinicName,
          cnpj: form.cnpj,
          email: form.email,
          phone: '',
          address: '',
          city: '',
          state: '',
          zip_code: '',
        });
      }

      // 3. Cria o funcionário vinculado à clínica → tabela: employee
      await employeeService.create({
        name: form.fullName,
        cpf: '',
        address: '',
        phone: '',
        email: form.email,
        role: existing ? 'employee' : 'admin',
        clinicId: clinic.id,
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.logoOverlay}>
          <img src={logoImg} alt="PetFlow" className={styles.logoImage} />
        </div>
        <div className={styles.imageArea}>
          <img
            src={dogImg}
            alt="Cachorro feliz"
            className={styles.heroImage}
          />
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Registre sua clínica!</h1>
          <p className={styles.subtitle}>
            Use as informações da sua clínica para preencher o cadastro.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Tabela: clinic */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="clinicName">
                Nome da clínica:
              </label>
              <input
                id="clinicName"
                type="text"
                className={styles.input}
                placeholder="Digite o nome da clínica..."
                value={form.clinicName}
                onChange={handleChange('clinicName')}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="cnpj">
                CNPJ:
              </label>
              <input
                id="cnpj"
                type="text"
                className={styles.input}
                placeholder="Digite o CNPJ da clínica..."
                value={form.cnpj}
                onChange={handleChange('cnpj')}
              />
            </div>

            {/* Tabela: employee */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="fullName">
                Seu nome completo:
              </label>
              <input
                id="fullName"
                type="text"
                className={styles.input}
                placeholder="Digite o seu nome completo..."
                value={form.fullName}
                onChange={handleChange('fullName')}
              />
            </div>

            {/* Tabela: clinic */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                E-mail:
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="nome@email.com"
                value={form.email}
                onChange={handleChange('email')}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                Senha:
              </label>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="Digite uma senha..."
                value={form.password}
                onChange={handleChange('password')}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </div>
          </form>

          <p className={styles.loginText}>
            Já tem uma conta?{' '}
            <Link to="/" className={styles.loginLink}>
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
