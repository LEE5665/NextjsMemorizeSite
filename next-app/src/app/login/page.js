'use client';

import { useState, useEffect } from 'react';
import styles from './LoginPage.module.css';
import ThemeToggle from '../../components/ThemeToggle';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const dark = document.documentElement.classList.contains('dark');
    setIsDark(dark);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('로그인 시도:', { email, password });
  };

  return (
    <main className={`${styles.container} ${isDark ? styles.dark : ''}`}>
      <ThemeToggle onThemeChange={setIsDark} />
      <form className={`${styles.form} ${isDark ? styles.dark : ''}`} onSubmit={handleSubmit}>
        <h2 className={`${styles.title} ${isDark ? styles.dark : ''}`}>로그인</h2>

        <label className={`${styles.label} ${isDark ? styles.dark : ''}`}>이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`${styles.input} ${isDark ? styles.dark : ''}`}
        />

        <label className={`${styles.label} ${isDark ? styles.dark : ''}`}>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`${styles.input} ${isDark ? styles.dark : ''}`}
        />

        <button type="submit" className={styles.button}>
          로그인
        </button>
      </form>
    </main>
  );
}
