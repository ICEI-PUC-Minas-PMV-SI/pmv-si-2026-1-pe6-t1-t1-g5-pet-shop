import { Link } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useLogin } from './useLogin';
import catImg from '../../assets/cat_login.png';
import logoImg from '../../assets/logo-petflow.png';
import styles from './Login.module.css';

export default function Login() {
  const {
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
  } = useLogin();

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
                className={`${styles.input} ${emailError ? styles.inputError : ''}`}
                placeholder="nome@petflow.com.br"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">Senha</label>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={styles.input}
                  placeholder="Digite sua senha..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={togglePassword}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
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
            </div>

            {(error || emailError) && <p className={styles.error}>{emailError || error}</p>}

            <button type="submit" className={styles.submitBtn} disabled={loading || !isFormValid}>
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
