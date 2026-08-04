import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginApi } from '../api';
import { useAuth } from '../AuthContext';
import './styles.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const history = useHistory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginApi({ email, password })
      .then(response => {
        login(response.data.token, response.data.user);
        toast.success(`Bem-vindo, ${response.data.user.name}!`);
        history.push(response.data.user.roles.includes('ROLE_FUNCIONARIO') ? '/admin' : '/orders');
      })
      .catch(() => {
        toast.error('Credenciais inválidas! Verifique e-mail e senha.');
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login DsDelivery</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>E-mail</label>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
            />
          </div>
          <div className="auth-form-group">
            <label>Senha</label>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>
          <button type="submit" className="auth-btn">ENTRAR</button>
        </form>
        <div className="auth-footer-link">
          Não tem conta? <Link to="/register">Cadastre-se aqui</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
