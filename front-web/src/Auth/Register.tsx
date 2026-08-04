import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerApi } from '../api';
import './styles.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isEmployee, setIsEmployee] = useState(false);
  const history = useHistory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerApi({ name, email, password, phone, employee: isEmployee })
      .then(() => {
        toast.success('Cadastro realizado com sucesso! Faça seu login.');
        history.push('/login');
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Erro ao realizar cadastro.');
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Criar Nova Conta</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>Nome Completo</label>
            <input
              type="text"
              className="auth-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Digite seu nome"
              required
            />
          </div>
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
            <label>Telefone</label>
            <input
              type="text"
              className="auth-input"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="(00) 00000-0000"
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
          <div className="auth-checkbox-group">
            <input
              type="checkbox"
              id="isEmployee"
              checked={isEmployee}
              onChange={e => setIsEmployee(e.target.checked)}
            />
            <label htmlFor="isEmployee" style={{ marginBottom: 0 }}>Perfil Funcionário / Administrador</label>
          </div>
          <button type="submit" className="auth-btn">CADASTRAR</button>
        </form>
        <div className="auth-footer-link">
          Já tem uma conta? <Link to="/login">Faça Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
