import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { authStorage } from '../../services/auth';
import dogImg from '../../assets/dog_register.png';
import logoImg from '../../assets/logo-petflow.png';
import styles from './Register.module.css';

export default function Register() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    cpf: '',
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

    if (!form.email || !form.password || !form.cpf || !form.fullName) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.register({
        email: form.email,
        password: form.password,
        name: form.fullName,
        full_name: form.fullName,
        cpf: form.cpf,
      });
      authStorage.save(data, true);
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
          <h1 className={styles.title}>Crie sua conta.</h1>
          <p className={styles.subtitle}>
            Preencha seus dados abaixo para realizar o cadastro.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
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

            <div className={styles.field}>
              <label className={styles.label} htmlFor="cpf">
                CPF:
              </label>
              <input
                id="cpf"
                type="text"
                className={styles.input}
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={handleChange('cpf')}
              />
            </div>

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
