import './styles.css';
import { ReactComponent as Logo } from './logo.svg';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Navbar() {
  const { user, isAuthenticated, isEmployee, logout } = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <nav className="main-navbar">
      <div className="nav-brand">
        <Logo />
        <Link to="/" className="logo-text">Ds Delivery</Link>
      </div>

      <div className="nav-actions">
        <Link to="/orders" className="nav-link">Fazer Pedido</Link>

        {isEmployee && (
          <Link to="/admin" className="nav-link">Painel Admin</Link>
        )}

        {isAuthenticated ? (
          <>
            <span className="nav-user-badge">
              {user?.name} ({isEmployee ? 'Funcionário' : 'Cliente'})
            </span>
            <button className="nav-btn" onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-btn">Cadastrar</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;