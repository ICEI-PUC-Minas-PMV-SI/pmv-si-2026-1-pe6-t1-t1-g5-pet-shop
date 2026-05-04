import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { authStorage } from '../../services/auth';
import catImg from '../../assets/cat_login.png';
import logoImg from '../../assets/logo-petflow.png';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(email, password);
      authStorage.save(data, remember);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Bem vindo de volta!</h1>
          <p className={styles.subtitle}>Faça login para acessar sua conta.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="nome@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="Digite sua senha..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={styles.options}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>Lembrar de mim</span>
              </label>
              <Link to="/esqueci-senha" className={styles.forgotLink}>
                Esqueci minha senha
              </Link>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className={styles.registerText}>
            Não tem uma conta?{' '}
            <Link to="/register" className={styles.registerLink}>
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.logoArea}>
          <img src={logoImg} alt="PetFlow" className={styles.logoImage} />
        </div>
        <div className={styles.imageArea}>
          <img
            src={catImg}
            alt="Gato laranja"
            className={styles.heroImage}
          />
        </div>
      </div>
    </div>
  );
}
